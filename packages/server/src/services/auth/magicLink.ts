import type { TMagicLink } from "@logchimp/types";
import { v4 as uuidv4 } from "uuid";
import database from "../../database";

// services
import { mail, generateContent } from "../mail";
import { createToken } from "../token.service";

// utils
import { configManager } from "../../utils/logchimpConfig";
import logger from "../../utils/logger";
import type { IMagicLinkJwtPayload } from "../../types";

const config = configManager.getConfig();

export async function generateMagicLink(
  tokenPayload: IMagicLinkJwtPayload,
): Promise<TMagicLink> {
  const token = createToken(tokenPayload, {
    expiresIn: "24h",
  });

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  try {
    // Check if user exists with this email
    const existingUser = await database("users")
      .where(database.raw("LOWER(email) = LOWER(?)", [tokenPayload.email]))
      .first();

    // Remove any existing unused magic links for this email/board combo
    await database.delete().from("magicLink").where({
      email: tokenPayload.email.toLowerCase(),
      boardId: tokenPayload.boardId,
      used: false,
    });

    const insertMagicLink = await database<TMagicLink>("magicLink")
      .insert({
        id: uuidv4(),
        email: tokenPayload.email.toLowerCase(),
        boardId: tokenPayload.boardId,
        token,
        userId: existingUser?.userId || null,
        used: false,
        expiresAt,
      })
      .returning("*");

    // Get board info for email context
    const board = await database
      .select("name")
      .from("boards")
      .where({ boardId: tokenPayload.boardId })
      .first();

    // Get site title
    const siteInfo = await database.select("title").from("settings").first();
    const siteTitle = siteInfo?.title || "Feedback";

    const urlObject = new URL(config.webUrl);
    const magicLinkMailContent = await generateContent("magic-link", {
      url: urlObject.origin,
      domain: urlObject.hostname,
      magicLink: `${urlObject.origin}/feedback/submit?token=${token}`,
      boardName: board?.name || "Feedback",
      siteTitle,
    });

    const noReplyEmail = `noreply@${urlObject.hostname}`;

    await mail.sendMail({
      from: noReplyEmail,
      to: tokenPayload.email,
      subject: `${siteTitle} - Submit your feedback`,
      text: magicLinkMailContent.text,
      html: magicLinkMailContent.html,
    });

    return insertMagicLink[0];
  } catch (err) {
    logger.error("Failed to generate magic link", err.message);
    throw err;
  }
}

export async function validateMagicLink(
  token: string,
): Promise<TMagicLink | null> {
  try {
    const magicLink = await database<TMagicLink>("magicLink")
      .select()
      .where({ token, used: false })
      .andWhere("expiresAt", ">", new Date())
      .first();

    return magicLink || null;
  } catch (err) {
    logger.error("Failed to validate magic link", err.message);
    return null;
  }
}

export async function markMagicLinkUsed(id: string): Promise<void> {
  try {
    await database("magicLink").update({ used: true }).where({ id });
  } catch (err) {
    logger.error("Failed to mark magic link as used", err.message);
  }
}
