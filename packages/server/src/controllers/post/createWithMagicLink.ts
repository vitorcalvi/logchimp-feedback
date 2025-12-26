import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import md5 from "md5";
import type {
  IApiErrorResponse,
  ICreatePostRequestBody,
  ICreatePostResponseBody,
} from "@logchimp/types";

import database from "../../database";
import { markMagicLinkUsed } from "../../services/auth/magicLink";
import { notifyNewPost } from "../../services/notifications";

// utils
import {
  validUUID,
  generateNanoID as nanoid,
  sanitiseUsername,
  generateUniqueUsername,
} from "../../helpers";
import logger from "../../utils/logger";
import error from "../../errorResponse.json";

type ResponseBody = ICreatePostResponseBody | IApiErrorResponse;

interface IMagicLinkSession {
  email: string;
  boardId: string;
  magicLinkId: string;
}

export async function createWithMagicLink(
  req: Request<unknown, unknown, ICreatePostRequestBody>,
  res: Response<ResponseBody>,
) {
  // @ts-expect-error - set by magicLinkAuth middleware
  const magicLinkSession: IMagicLinkSession = req.magicLinkSession;

  if (!magicLinkSession) {
    return res.status(401).send({
      message: "Invalid magic link session",
      code: "INVALID_SESSION",
    });
  }

  const { email, boardId: authorizedBoardId, magicLinkId } = magicLinkSession;

  const title = req.body.title || "new post";
  const contentMarkdown = req.body.contentMarkdown;
  const boardId = validUUID(req.body.boardId);
  const screenshots = req.body.screenshots || [];

  // Verify the board matches the magic link's authorized board
  if (boardId !== authorizedBoardId) {
    return res.status(403).send({
      message: "This magic link is not authorized for this board",
      code: "BOARD_MISMATCH",
    });
  }

  const slugId = nanoid(20);
  const slug = `${title
    .replace(/[^\w\s]/gi, "")
    .replace(/\s\s+/gi, " ")
    .toLowerCase()
    .split(" ")
    .join("-")}-${slugId}`;

  try {
    // Check if user exists, or create anonymous user record
    let user = await database("users")
      .select("userId", "email", "username", "avatar")
      .where(database.raw("LOWER(email) = LOWER(?)", [email]))
      .first();

    if (!user) {
      // Create anonymous user (no password)
      const userId = uuidv4();
      const avatar = `https://www.gravatar.com/avatar/${md5(email.toLowerCase())}`;
      const baseUsername = sanitiseUsername(email.split("@")[0].slice(0, 30));
      const username = generateUniqueUsername(baseUsername);

      const [newUser] = await database
        .insert({
          userId,
          email: email.toLowerCase(),
          username,
          avatar,
          isVerified: false,
        })
        .into("users")
        .returning(["userId", "email", "username", "avatar"]);

      // Assign @everyone role
      const everyoneRole = await database("roles")
        .select("id")
        .where({ name: "@everyone" })
        .first();

      if (everyoneRole) {
        await database
          .insert({
            id: uuidv4(),
            role_id: everyoneRole.id,
            user_id: newUser.userId,
          })
          .into("roles_users");
      }

      user = newUser;
    }

    // Create the post
    const createPost = await database
      .insert({
        postId: uuidv4(),
        title,
        slug,
        slugId,
        contentMarkdown,
        userId: user.userId,
        boardId,
        screenshots: JSON.stringify(screenshots),
      })
      .into("posts")
      .returning("*");

    const post = createPost[0];

    // Auto-upvote the post by the creator
    await database
      .insert({
        voteId: uuidv4(),
        userId: user.userId,
        postId: post.postId,
      })
      .into("votes");

    // Mark the magic link as used
    await markMagicLinkUsed(magicLinkId);

    // Send notification (async, non-blocking)
    const board = await database
      .select("name")
      .from("boards")
      .where({ boardId })
      .first();

    notifyNewPost({
      postTitle: title,
      postSlug: post.slug,
      boardName: board?.name || "Unknown Board",
      userEmail: email,
    }).catch((err) => logger.error("Notification failed:", err));

    res.status(201).send({
      post,
    });
  } catch (err) {
    logger.log({
      level: "error",
      message: err,
    });

    res.status(500).send({
      message: error.general.serverError,
      code: "SERVER_ERROR",
    });
  }
}
