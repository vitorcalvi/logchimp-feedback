import database from "../../database";

// services
import { mail, generateContent } from "../mail";

// utils
import { configManager } from "../../utils/logchimpConfig";
import logger from "../../utils/logger";

const config = configManager.getConfig();

interface NotifyNewPostParams {
  postTitle: string;
  postSlug: string;
  boardName: string;
  userEmail: string;
}

export async function notifyNewPost(params: NotifyNewPostParams): Promise<void> {
  try {
    // Get settings
    const settings = await database
      .select("title", "adminNotificationEmail", "notifyOnNewPost")
      .from("settings")
      .first();

    if (!settings?.notifyOnNewPost || !settings?.adminNotificationEmail) {
      return; // Notifications disabled or no admin email configured
    }

    const urlObject = new URL(config.webUrl);

    const emailContent = await generateContent("new-post-notification", {
      url: urlObject.origin,
      domain: urlObject.hostname,
      postTitle: params.postTitle,
      postUrl: `${urlObject.origin}/posts/${params.postSlug}`,
      boardName: params.boardName,
      userEmail: params.userEmail,
      siteTitle: settings.title || "Dyagnosys Feedback",
    });

    if (!emailContent) {
      logger.warn("Failed to generate new post notification email");
      return;
    }

    await mail.sendMail({
      from: `noreply@${urlObject.hostname}`,
      to: settings.adminNotificationEmail,
      subject: `[${settings.title}] New feedback: ${params.postTitle}`,
      text: emailContent.text,
      html: emailContent.html,
    });

    logger.info(`Sent new post notification to ${settings.adminNotificationEmail}`);
  } catch (err) {
    logger.error("Failed to send new post notification", err);
  }
}
