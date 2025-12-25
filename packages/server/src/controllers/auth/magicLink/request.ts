import type { Request, Response } from "express";
import type {
  IMagicLinkRequestBody,
  IMagicLinkRequestResponseBody,
  IApiErrorResponse,
} from "@logchimp/types";

// services
import { generateMagicLink } from "../../../services/auth/magicLink";

// database
import database from "../../../database";

// utils
import logger from "../../../utils/logger";
import error from "../../../errorResponse.json";
import { isDevTestEnv, validUUID } from "../../../helpers";
import type { IMagicLinkJwtPayload } from "../../../types";

type ResponseBody = IMagicLinkRequestResponseBody | IApiErrorResponse;

export async function request(
  req: Request<unknown, unknown, IMagicLinkRequestBody>,
  res: Response<ResponseBody>,
) {
  const { email, boardId } = req.body;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).send({
      message: "Invalid email address",
      code: "EMAIL_INVALID",
    });
  }

  // Validate board exists
  const validBoardId = validUUID(boardId);
  if (!validBoardId) {
    return res.status(400).send({
      message: "Invalid board ID",
      code: "INVALID_BOARD_ID",
    });
  }

  try {
    const board = await database("boards")
      .where({ boardId: validBoardId })
      .first();

    if (!board) {
      return res.status(404).send({
        message: error.api.boards.boardNotFound,
        code: "BOARD_NOT_FOUND",
      });
    }

    const tokenPayload: IMagicLinkJwtPayload = {
      email: email.toLowerCase(),
      boardId: validBoardId,
      type: "magicLink",
    };

    const magicLink = await generateMagicLink(tokenPayload);

    const __token = isDevTestEnv
      ? {
          ...magicLink,
        }
      : undefined;

    res.status(200).send({
      success: true,
      message: "Magic link sent to your email",
      __token,
    });
  } catch (err) {
    logger.error({
      message: err,
    });

    res.status(500).send({
      message: error.general.serverError,
      code: "SERVER_ERROR",
    });
  }
}
