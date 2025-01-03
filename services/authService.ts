import { UserModel } from "../models/index";
import httpStatus from "http-status";

import APIError from "../utils/ApiError";
import bcrypt from "bcryptjs";
import { IUser } from "../models/UserModel";

const createNewUser = async (user: IUser) => {
  const oldUser = await UserModel.findOne({ email: user.email.toLowerCase() });

  if (oldUser)
    throw new APIError(httpStatus.BAD_REQUEST, "Email already exists.");
  const newUser = await UserModel.create(user);
  if (!newUser)
    throw new APIError(
      httpStatus.BAD_REQUEST,
      "Oops...seems our server needed a break!"
    );
  return newUser;
};

const createNewGoogleUser = async ({
  id,
  email,
  firstName,
  lastName,
  profilePhoto,
}: any) => {
  const oldUser = await UserModel.findOne({ email: email.toLowerCase() });
  if (oldUser)
    throw new APIError(httpStatus.BAD_REQUEST, "Email already exists.");
  const newUser = await UserModel.create({
    email,
    fullName: `${firstName} ${lastName}`,

    source: "google",
  });
  if (!newUser)
    throw new APIError(
      httpStatus.BAD_REQUEST,
      "Oops...seems our server needed a break!"
    );
  return newUser;
};

const fetchUserFromEmailAndPassword = async ({ email, password }: IUser) => {
  const user = await UserModel.findOne({
    email: email.toLowerCase(),
  }).lean();

  if (!user) throw new APIError(httpStatus.BAD_REQUEST, "invalid credentials");
  if (!password || !user.password) {
    throw new APIError(httpStatus.BAD_REQUEST, "Password is required");
  }
  let passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches)
    throw new APIError(httpStatus.BAD_REQUEST, "invalid credentials");

  return user;
};
const fetchUserFromEmail = async ({ email }: IUser) => {
  const user = await UserModel.findOne({
    email: email.toLowerCase(),
  }).lean();

  if (!user)
    throw new APIError(
      httpStatus.BAD_REQUEST,
      "please sign up - this email does not exist"
    );

  return user;
};

const verifyUserFromRefreshTokenPayload = async (userId: string) => {
  const userExists = await UserModel.exists({
    _id: userId,
  });

  if (!userExists)
    throw new APIError(httpStatus.FORBIDDEN, "Invalid Refresh Token - logout");
};

const fetchUserFromAuthData = async (userId: string) => {
  const user = await UserModel.findOne({
    _id: userId,
  }).lean();

  if (!user)
    throw new APIError(httpStatus.UNAUTHORIZED, "invalid access token user");

  return user;
};

const verifyCurrentPassword = async (userId: string, password: string) => {
  const user = await UserModel.findOne({
    _id: userId,
  })
    .select("password")
    .lean();

  if (!user) throw new APIError(httpStatus.BAD_REQUEST, "User not found");
  if (!password || !user.password) {
    throw new APIError(httpStatus.BAD_REQUEST, "Password is required");
  }
  let passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches)
    throw new APIError(httpStatus.BAD_REQUEST, "invalid current password");
};

const updatePassword = async (userId: string, newPassword: string) => {
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

  if (!user)
    throw new APIError(
      httpStatus.BAD_REQUEST,
      "Oops...seems our server needed a break!"
    );
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
