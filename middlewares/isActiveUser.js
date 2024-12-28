import APIError from "../utils/APIError.js";
import { UserModel, RefreshTokenModel } from "../models/index.js";
import httpStatus from "http-status";
import { tokenTypes } from "../config/tokens.js";
import { verify } from "../utils/jwtHelpers.js";

const isActiveUser = async (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");
    console.log("authorizationHeader", authorizationHeader);
    if (!authorizationHeader) {
      throw new APIError(
        httpStatus.UNAUTHORIZED,
        "No Authorization header provided"
      );
    }

    const [bearer, accessToken] = authorizationHeader.split(" ");
    console.log(bearer, accessToken);
    if (bearer !== "Bearer" || !accessToken) {
      throw new APIError(
        httpStatus.UNAUTHORIZED,
        "Invalid Access Token format"
      );
    }
    let tokenPayload = await verify(accessToken, process.env.JWT_SECRET);
    console.log("tokenPayload", tokenPayload);

    if (!tokenPayload || tokenPayload.type !== tokenTypes.ACCESS)
      throw new APIError(httpStatus.UNAUTHORIZED, "Invalid Access Token");

    let userExists = await UserModel.exists({
      _id: tokenPayload.userId,
    });

    console.log("userExists", JSON.stringify(userExists, null, 2));
    if (!userExists) {
      console.log("andr hu");
      throw new APIError(httpStatus.FORBIDDEN, "Invalid Access Token - logout");
    }

    let refreshTokenExists = await RefreshTokenModel.exists({
      userRef: tokenPayload.userId,
      loginTime: tokenPayload.loginTime,
    });

    if (!refreshTokenExists)
      throw new APIError(httpStatus.FORBIDDEN, "Invalid Access Token - logout");

    req.authData = tokenPayload;

    next();
  } catch (error) {
    next(error);
  }
};

export { isActiveUser };
