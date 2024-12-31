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
import { IUser } from "../models/UserModel";
import ApiError from "../utils/ApiError";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register new user
const register = async (req: any, res: any, next: any) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await createNewUser({
      email: email,
      password: hashedPassword,
      source: "email",
    });
    const tokens = await generateAuthTokens(newUser);
    res.json({ user: newUser, tokens });
  } catch (error) {
    next(error);
  }
};

// User login
const login = async (req: any, res: any, next: any) => {
  try {
    const user = await fetchUserFromEmailAndPassword(req.body);
    const tokens = await generateAuthTokens(user);
    res.json({ user, tokens });
  } catch (error) {
    next(error);
  }
};

// Logout user
const logout = async (req: any, res: any, next: any) => {
  try {
    await clearRefreshToken(req.body.refreshToken);
    res.json({});
  } catch (error) {
    next(error);
  }
};

// Refresh access token
const refreshToken = async (req: any, res: any, next: any) => {
  try {
    const { refreshToken } = req.body;

    const refreshTokenPayload = await verifyRefreshToken(refreshToken);
    if (!refreshTokenPayload) {
      throw new Error("Invalid Refresh Token - logout");
    }
    await verifyUserFromRefreshTokenPayload(refreshTokenPayload);
    let newAccessToken = await generateAccessTokenFromRefreshTokenPayload(
      refreshTokenPayload
    );

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

// Reset password
const resetPassword = async (req: any, res: any, next: any) => {
  try {
    await verifyCurrentPassword(req.authData.userId, req.body.password);
    await updatePassword(req.authData.userId, req.body.newPassword);

    res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
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
      throw new Error("Invalid token payload");
    }
    const { name, email, picture } = payload;
    if (!email) {
      throw new ApiError(400, "Email is required");
    }
    const newUser = await createNewUser({
      email,
      fullName: name,
      avatar: picture,
      verified: true,
      source: "google",
    });
    const tokens = await generateAuthTokens(newUser);
    res.json({ user: newUser, tokens });
  } catch (error) {
    next(error);
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
      throw new Error("Invalid token payload");
    }
    const { email } = payload;
    if (!email) {
      throw new Error("Email is required");
    }
    const user = await fetchUserFromEmail({ email });
    const tokens = await generateAuthTokens(user);
    res.json({ user, tokens });
  } catch (error) {
    next(error);
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
