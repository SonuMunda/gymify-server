import APIError from "../utils/ApiError";
import { UserModel, RefreshTokenModel } from "../models/index";
import httpStatus from "http-status";
import { tokenTypes } from "../config/tokens";
import { verify } from "../utils/jwtHelpers";
import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/ResponseHelpers";

const isActiveUser = async (req: any, res: any, next: any) => {
  try {
    const authorizationHeader = req.get("Authorization");

    console.log(" Authorization header ", authorizationHeader);
    if (!authorizationHeader) {
      errorResponse(res, "No Authorization header provided", 401);
      return;
    }

    const [bearer, accessToken] = authorizationHeader.split(" ");

    if (bearer !== "Bearer" || !accessToken) {
      errorResponse(res, "Invalid Authorization header", 401);
      return;
    }
    let tokenPayload = (await verify(
      accessToken,
      process.env.JWT_SECRET as string
    )) as any;

    if (!tokenPayload || tokenPayload.type !== tokenTypes.ACCESS) {
      errorResponse(res, "Invalid Access Token", 401);
      return;
    }

    let userExists = await UserModel.exists({
      _id: tokenPayload.userId,
    });
    if (!userExists) {
      errorResponse(res, "Invalid Access Token - logout", 401);
      return;
    }

    let refreshTokenExists = await RefreshTokenModel.exists({
      userRef: tokenPayload.userId,
      loginTime: tokenPayload.loginTime,
    });

    if (!refreshTokenExists) {
      errorResponse(res, "Invalid Access Token - logout", 401);
      return;
    }

    req.authData = tokenPayload;

    next();
  } catch (error: any) {
    console.log("Error in isActiveUser middleware", error);
    errorResponse(res, "Invalid Access Token", 401, error);
    return;
  }
};

export { isActiveUser };
