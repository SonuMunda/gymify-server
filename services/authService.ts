import { UserModel } from "../models/index";
import httpStatus from "http-status";

import APIError from "../utils/ApiError";
import bcrypt from "bcryptjs";
import { IUser } from "../models/UserModel";
import { errorResponse } from "../utils/ResponseHelpers";

const createNewUser = async (res: any, user: IUser) => {
  const oldUser = await UserModel.findOne({ email: user.email.toLowerCase() });

  if (oldUser) {
    errorResponse(res, "Email already exists.", 400);
    return;
  }
  const newUser = await UserModel.create(user);
  if (!newUser) {
    errorResponse(res, "Oops...seems our server needed a break!", 400);
    return;
  }
  return newUser;
};

const createNewGoogleUser = async (
  res: any,
  { id, email, firstName, lastName, profilePhoto }: any
) => {
  const oldUser = await UserModel.findOne({ email: email.toLowerCase() });
  if (oldUser) {
    errorResponse(res, "Email already exists.", 400);
    return;
  }
  const newUser = await UserModel.create({
    email,
    fullName: `${firstName} ${lastName}`,

    source: "google",
  });
  if (!newUser) {
    errorResponse(res, "Oops...seems our server needed a break!", 400);
    return;
  }
  return newUser;
};

const fetchUserFromEmailAndPassword = async (
  res: any,
  { email, password }: IUser
) => {
  const user = await UserModel.findOne({
    email: email.toLowerCase(),
  }).lean();

  if (!user) {
    errorResponse(res, "please sign up - this email does not exist", 400);
    return;
  }
  if (!password || !user.password) {
    errorResponse(res, "Password is required", 400);
    return;
  }
  let passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    errorResponse(res, "invalid password", 400);

    return;
  }

  return user;
};
const fetchUserFromEmail = async (res: any, { email }: IUser) => {
  const user = await UserModel.findOne({
    email: email.toLowerCase(),
  }).lean();

  if (!user) {
    errorResponse(res, "please sign up - this email does not exist", 400);
    return;
  }

  return user;
};

const verifyUserFromRefreshTokenPayload = async (res: any, userId: string) => {
  const userExists = await UserModel.exists({
    _id: userId,
  });

  if (!userExists) {
    errorResponse(res, "invalid access token user", 400);
    return;
  }
};

const fetchUserFromAuthData = async (res: any, userId: string) => {
  const user = await UserModel.findOne({
    _id: userId,
  }).lean();

  if (!user) {
    errorResponse(res, "User not found", 400);
    return;
  }

  return user;
};

const verifyCurrentPassword = async (res:any,userId: string, password: string) => {
  const user = await UserModel.findOne({
    _id: userId,
  })
    .select("password")
    .lean();

  if (!user) {
    errorResponse(res, "User not found", 400);
    return;
  }
  if (!password || !user.password) {
    errorResponse(res, "Password is required", 400);
    return;
  }
  let passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    errorResponse(res, "invalid password", 400);
    return;
  }
};

const updatePassword = async (
  res: any,
  userId: string,
  newPassword: string
) => {
  let newHash = await bcrypt.hash(newPassword, 10);

  let user = await UserModel.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      password: newHash,
    },
    {
      new: true,
    }
  );

  if (!user) {
    errorResponse(res, "User not found", 400);
    return;
  }
};

export {
  fetchUserFromEmailAndPassword,
  fetchUserFromEmail,
  verifyUserFromRefreshTokenPayload,
  fetchUserFromAuthData,
  verifyCurrentPassword,
  updatePassword,
  createNewUser,
  createNewGoogleUser,
};
