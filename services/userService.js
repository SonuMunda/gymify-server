import { UserModel } from "../models/index.js";
import ApiError from "../utils/APIError.js";

const getUserFromId = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new ApiError("Invaid User Id");
  return user;
};

const getUserFromUsername = async (username) => {
  const user = await UserModel.findOne({ username }).select("username");
  return user;
};
export { getUserFromId, getUserFromUsername };
