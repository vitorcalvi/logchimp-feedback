import axios, { type AxiosResponse } from "axios";
import type {
  IAuthLoginRequestBody,
  IAuthLoginResponseBody,
  IAuthPasswordResetResponseBody,
  IAuthSignupResponseBody,
  IPasswordResetValidationTokenResponseBody,
  ISetPasswordRequestBody,
  ISetPasswordResponseBody,
  IValidateEmailVerificationTokenResponseBody,
  TAuthSignupRequestBody,
  IMagicLinkRequestBody,
  IMagicLinkRequestResponseBody,
  IMagicLinkValidateResponseBody,
} from "@logchimp/types";

import { VITE_API_URL } from "../constants";

/**
 * Sign in to user account
 * @param {object} arg0
 * @param {string} arg0.email user email address
 * @param {string} arg0.password user password
 * @returns {Promise<AxiosResponse<IAuthLoginResponseBody>>} response
 */
export const signin = async ({
  email,
  password,
}: IAuthLoginRequestBody): Promise<AxiosResponse<IAuthLoginResponseBody>> => {
  return await axios({
    method: "POST",
    url: `${VITE_API_URL}/api/v1/auth/login`,
    data: {
      email,
      password,
    },
  });
};

/**
 * Create user account
 * @param {object} arg0
 * @param {string} arg0.email user email address
 * @param {string} arg0.password user password
 * @returns {Promise<AxiosResponse<IAuthSignupResponseBody>>} response
 */
export const signup = async ({
  email,
  password,
}: TAuthSignupRequestBody): Promise<AxiosResponse<IAuthSignupResponseBody>> => {
  return await axios({
    method: "POST",
    url: `${VITE_API_URL}/api/v1/auth/signup`,
    data: {
      email,
      password,
    },
  });
};

/**
 * Validate user email address
 * @param {string} token email address verification token
 * @returns {Promise<AxiosResponse<IValidateEmailVerificationTokenResponseBody>>} response
 */
export const verifyUserEmail = async (
  token: string,
): Promise<AxiosResponse<IValidateEmailVerificationTokenResponseBody>> => {
  return await axios({
    method: "POST",
    url: `${VITE_API_URL}/api/v1/auth/email/validate`,
    data: {
      token,
    },
  });
};

/**
 * Request for password reset
 * @param {string} email user email address
 * @returns {Promise<AxiosResponse<IAuthPasswordResetResponseBody>>} response
 */
export const requestPasswordReset = async (
  email: string,
): Promise<AxiosResponse<IAuthPasswordResetResponseBody>> => {
  return await axios({
    method: "POST",
    url: `${VITE_API_URL}/api/v1/auth/password/reset`,
    data: {
      email,
    },
  });
};

/**
 * Validate reset password token
 * @param {string} token reset password token
 * @returns {Promise<AxiosResponse<IPasswordResetValidationTokenResponseBody>>} response
 */
export const validateResetPasswordToken = async (
  token: string,
): Promise<AxiosResponse<IPasswordResetValidationTokenResponseBody>> => {
  return await axios({
    method: "POST",
    url: `${VITE_API_URL}/api/v1/auth/password/validateToken`,
    data: {
      token,
    },
  });
};

/**
 * Set new password
 * @param {object} arg0
 * @param {string} arg0.token reset password token
 * @param {string} arg0.password new password
 * @returns {Promise<AxiosResponse<ISetPasswordResponseBody>>} response
 */
export const setNewPassword = async ({
  token,
  password,
}: ISetPasswordRequestBody): Promise<
  AxiosResponse<ISetPasswordResponseBody>
> => {
  return await axios({
    method: "POST",
    url: `${VITE_API_URL}/api/v1/auth/password/set`,
    data: {
      token,
      password,
    },
  });
};

/**
 * Request magic link for feedback submission
 * @param {object} data
 * @param {string} data.email user email address
 * @param {string} data.boardId target board ID
 * @returns {Promise<AxiosResponse<IMagicLinkRequestResponseBody>>} response
 */
export const requestMagicLink = async (
  data: IMagicLinkRequestBody,
): Promise<AxiosResponse<IMagicLinkRequestResponseBody>> => {
  return await axios({
    method: "POST",
    url: `${VITE_API_URL}/api/v1/auth/magic-link/request`,
    data,
  });
};

/**
 * Validate magic link token
 * @param {string} token magic link token
 * @returns {Promise<AxiosResponse<IMagicLinkValidateResponseBody>>} response
 */
export const validateMagicLink = async (
  token: string,
): Promise<AxiosResponse<IMagicLinkValidateResponseBody>> => {
  return await axios({
    method: "POST",
    url: `${VITE_API_URL}/api/v1/auth/magic-link/validate`,
    data: {
      token,
    },
  });
};

/**
 * Submit feedback with magic link session token
 * @param {object} post post data
 * @param {string} sessionToken magic link session token
 * @returns {Promise<AxiosResponse>} response
 */
export const submitFeedbackWithMagicLink = async (
  post: {
    title: string;
    contentMarkdown: string;
    boardId: string;
    screenshots?: string[];
  },
  sessionToken: string,
): Promise<AxiosResponse<{ post: unknown }>> => {
  return await axios({
    method: "POST",
    url: `${VITE_API_URL}/api/v1/posts/magic-link`,
    data: post,
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });
};
