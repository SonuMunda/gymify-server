import * as httpStatus from "http-status";
import { UserModel } from "../models/index";

import ApiError from "../utils/ApiError";

const getUserFromId = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user)
    throw new ApiError(httpStatus.BAD_REQUEST, "Invaid User Id", userId);
  return user;
};

const getUserFromUsername = async (username: string) => {
  const user = await UserModel.findOne({ username }).select("username");
  return user;
};
export { getUserFromId, getUserFromUsername };
