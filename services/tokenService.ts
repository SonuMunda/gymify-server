import { sign, verify } from "../utils/jwtHelpers";
import { tokenTypes } from "../config/tokens";

import { RefreshTokenModel } from "../models/index";
import moment from "moment";
import httpStatus from "http-status";

import APIError from "../utils/ApiError";
import { IUser } from "../models/UserModel";

interface TokenPayload {
  userId: string;
  loginTime: moment.Moment;
  exp: number;
  type: string;
}
const generateToken = async (
  userId: string,
  loginTime: any,
  role: string,
  exp: any,
  type: string
) => {
  const payload = {
    userId,
    role,
    loginTime: new Date(loginTime.valueOf()),
    exp: exp.unix(),
    type,
  };
  let token = await sign(payload, process.env.JWT_SECRET as string);
  return token;
};

const saveRefreshToken = async (
  userId: string,
  loginTime: any,
  token: string
) => {
  await RefreshTokenModel.findOneAndUpdate(
    { userRef: userId },
    {
      loginTime: new Date(loginTime.valueOf()),
      token: token,
    },
    {
      upsert: true,
    }
  );
};

const clearRefreshToken = async (token: string) => {
  await RefreshTokenModel.findOneAndDelete({ token: token });
};

const generateAuthTokens = async (user: any) => {
  const loginTime = moment();
  let accessTokenExpiresAt = loginTime
    .clone()
    .add(process.env.ACCESS_TOKEN_EXPIRATION_MINUTES, "minutes");

  const accessToken = await generateToken(
    user._id,
    loginTime,
    user.role,
    accessTokenExpiresAt,
    tokenTypes.ACCESS as string
  );

  let refreshTokenExpiresAt = loginTime
    .clone()
    .add(process.env.REFRESH_TOKEN_EXPIRATION_DAYS, "days");

  const refreshToken = await generateToken(
    user._id,
    loginTime,
    user.role,
    refreshTokenExpiresAt,
    tokenTypes.REFRESH as string
  );

  await saveRefreshToken(user._id, loginTime, refreshToken as string);

  return {
    accessToken,
    refreshToken,
  };
};

const generateAccessTokenFromRefreshTokenPayload = async ({
  userId,
  loginTime,
  platform,
  role
}: {
  userId: string;
  role: string;
  loginTime: any;
  platform: any;
}) => {
  const now = moment();
  let accessTokenExpiresAt = now.add(
    process.env.ACCESS_TOKEN_EXPIRATION_MINUTES,
    "minutes"
  );

  const accessToken = await generateToken(
    userId,
    moment(loginTime),
    role,
    accessTokenExpiresAt,
    tokenTypes.ACCESS as string
  );

  return accessToken;
};

const verifyRefreshToken = async (token: string) => {
  let tokenPayload = (await verify(
    token,
    process.env.JWT_SECRET as string
  )) as any;

  if (!tokenPayload || tokenPayload.type !== tokenTypes.REFRESH)
    throw new APIError(httpStatus.FORBIDDEN, "Invalid Refresh Token - logout");

  let refreshTokenExists = await RefreshTokenModel.exists({ token: token });
  if (!refreshTokenExists)
    throw new APIError(httpStatus.FORBIDDEN, "Invalid Refresh Token - logout");

  return tokenPayload;
};

export {
  generateAuthTokens,
  clearRefreshToken,
  verifyRefreshToken,
  generateAccessTokenFromRefreshTokenPayload,
};
