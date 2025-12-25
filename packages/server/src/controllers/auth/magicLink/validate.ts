import type { Request, Response } from "express";
import type {
  IMagicLinkValidateRequestBody,
  IMagicLinkValidateResponseBody,
  IApiErrorResponse,
} from "@logchimp/types";

// services
import { validateMagicLink } from "../../../services/auth/magicLink";
import { createToken } from "../../../services/token.service";

// utils
import logger from "../../../utils/logger";
import error from "../../../errorResponse.json";

type ResponseBody = IMagicLinkValidateResponseBody | IApiErrorResponse;

export async function validate(
  req: Request<unknown, unknown, IMagicLinkValidateRequestBody>,
  res: Response<ResponseBody>,
) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send({
      message: "Token is required",
      code: "MISSING_TOKEN",
    });
  }

  try {
    const magicLink = await validateMagicLink(token);

    if (!magicLink) {
      return res.status(401).send({
        message: "Invalid or expired magic link",
        code: "INVALID_TOKEN",
      });
    }

    // Create a temporary session token for feedback submission
    // This token is short-lived and scoped to the specific board
    const sessionToken = createToken(
      {
        email: magicLink.email,
        boardId: magicLink.boardId,
        magicLinkId: magicLink.id,
        type: "magicLinkSession",
      },
      { expiresIn: "1h" },
    );

    res.status(200).send({
      valid: true,
      boardId: magicLink.boardId,
      email: magicLink.email,
      sessionToken,
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
