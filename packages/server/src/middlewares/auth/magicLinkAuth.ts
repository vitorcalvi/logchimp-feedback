import type { NextFunction, Request, Response } from "express";
import type { IApiErrorResponse } from "@logchimp/types";
import jwt from "jsonwebtoken";

import { extractTokenFromHeader } from "./helpers";
import { configManager } from "../../utils/logchimpConfig";
import error from "../../errorResponse.json";
import logger from "../../utils/logger";
import type { IMagicLinkSessionJwtPayload } from "../../types";

const config = configManager.getConfig();

export async function magicLinkAuth(
  req: Request,
  res: Response<IApiErrorResponse>,
  next: NextFunction,
) {
  // check for authorization header
  if (!req.headers?.authorization) {
    return res.status(400).send({
      message: error.middleware.auth.invalidAuthHeader,
      code: "INVALID_AUTH_HEADER",
    });
  }

  // extract token from authorization header
  const token = extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    return res.status(401).send({
      message: error.middleware.auth.invalidAuthHeaderFormat,
      code: "INVALID_AUTH_HEADER_FORMAT",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      config.secretKey,
    ) as IMagicLinkSessionJwtPayload;

    if (decoded.type !== "magicLinkSession") {
      return res.status(401).send({
        message: "Invalid token type",
        code: "INVALID_TOKEN_TYPE",
      });
    }

    // Attach magic link session info to request
    // @ts-expect-error
    req.magicLinkSession = {
      email: decoded.email,
      boardId: decoded.boardId,
      magicLinkId: decoded.magicLinkId,
    };

    next();
  } catch (err) {
    logger.error(err);

    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return res.status(401).send({
        message: error.middleware.auth.invalidToken,
        code: "INVALID_TOKEN",
      });
    }

    res.status(500).send({
      message: error.general.serverError,
      code: "SERVER_ERROR",
    });
  }
}
