import bcryptjs from "bcryptjs";
import {
  fetchUserFromEmailAndPassword,
  updatePassword,
  verifyCurrentPassword,
  verifyUserFromRefreshTokenPayload,
  createNewUser,
  fetchUserFromEmail,
} from "../services/authService";
import {
  generateAuthTokens,
  clearRefreshToken,
  verifyRefreshToken,
  generateAccessTokenFromRefreshTokenPayload,
} from "../services/tokenService";
import { OAuth2Client } from "google-auth-library";
import UserModel, { IUser } from "../models/UserModel";
import ApiError from "../utils/ApiError";
import { errorResponse, successResponse } from "../utils/ResponseHelpers";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req: any, res: any, next: any) => {
  const { email, password, fullName, username } = req.body;
  try {
    if (!email || !password || !fullName || !username) {
      errorResponse(res, "All fields are required", 400);
      return;
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const checkUserNameExists = await UserModel.findOne({ username }).select(
      "username"
    );
    if (checkUserNameExists) {
      errorResponse(res, "Username already exists", 400);
      return;
    }
    const newUser = await createNewUser(res, {
      email: email,
      password: hashedPassword,
      source: "email",
      fullName: fullName,
      username: username,
    });
    const tokens = await generateAuthTokens(newUser);
    successResponse(res, "User registered successfully", {
      user: newUser,
      tokens,
    });
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

// User login
const login = async (req: any, res: any, next: any) => {
  try {
    const user = await fetchUserFromEmailAndPassword(res, req.body);
    const tokens = await generateAuthTokens(user);
    successResponse(res, "User logged in successfully", { user, tokens });
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

// Logout user
const logout = async (req: any, res: any, next: any) => {
  try {
    await clearRefreshToken(req.body.refreshToken);
    successResponse(res, "User logged out successfully");
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

// Refresh access token
const refreshToken = async (req: any, res: any, next: any) => {
  try {
    const { refreshToken } = req.body;

    const refreshTokenPayload = await verifyRefreshToken(refreshToken);
    if (!refreshTokenPayload) {
      errorResponse(res, "Invalid refresh token", 401);
      return;
    }
    await verifyUserFromRefreshTokenPayload(res, refreshTokenPayload);
    let newAccessToken = await generateAccessTokenFromRefreshTokenPayload(
      refreshTokenPayload
    );

    successResponse(res, "Token refreshed successfully", {
      accessToken: newAccessToken,
    });
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

// Reset password
const resetPassword = async (req: any, res: any, next: any) => {
  try {
    await verifyCurrentPassword(res, req.authData.userId, req.body.password);
    await updatePassword(res, req.authData.userId, req.body.newPassword);

    successResponse(res, "Password updated successfully", {}, 200);
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

// Google user registration
const googleUserRegister = async (req: any, res: any, next: any) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      errorResponse(res, "Invalid token payload", 400);
      return;
    }
    const { name, email, picture } = payload;
    if (!email) {
      errorResponse(res, "Email is required", 400);
      return;
    }
    const newUser = await createNewUser(res, {
      email,
      fullName: name,
      avatar: picture,
      verified: true,
      source: "google",
    });
    const tokens = await generateAuthTokens(newUser);
    successResponse(res, "User registered successfully", {
      user: newUser,
      tokens,
    });
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

const googleUserLogin = async (req: any, res: any, next: any) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      errorResponse(res, "Invalid token payload", 400);
      return;
    }
    const { email } = payload;
    if (!email) {
      errorResponse(res, "Email is required", 400);
      return;
    }
    const user = await fetchUserFromEmail(res, { email });
    const tokens = await generateAuthTokens(user);

    successResponse(res, "User logged in successfully", { user, tokens });
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

export default {
  login,
  logout,
  refreshToken,
  resetPassword,
  register,
  googleUserRegister,
  googleUserLogin,
};
