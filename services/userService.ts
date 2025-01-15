import * as httpStatus from "http-status";
import { UserModel } from "../models/index";

import ApiError from "../utils/ApiError";
import { errorResponse } from "../utils/ResponseHelpers";

const getUserFromId = async (res: any, userId: string) => {
  const user = await UserModel.findById(userId).select(
    "-password -createdAt -updatedAt"
  );
  if (!user) {
    errorResponse(res, "User not found", httpStatus.NOT_FOUND);
    return;
  }
  return user;
};

const getUserFromUsername = async (res: any, username: string) => {
  const user = await UserModel.findOne({ username }).select("username");
  if (!user) {
    errorResponse(res, "User not found", httpStatus.NOT_FOUND);
    return;
  }
  return user;
};
export { getUserFromId, getUserFromUsername };
