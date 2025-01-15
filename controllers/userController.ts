import { getUserFromId, getUserFromUsername } from "../services/userService";
import UserModel, { IUser } from "../models/UserModel";
import { errorResponse, successResponse } from "../utils/ResponseHelpers";

const getUserInfo = async (req: any, res: any, next: any) => {
  const userId = req.authData.userId;
  try {
    const user = await getUserFromId(res, userId);
    if (!user) return;

    const responseUser = {
      id: user.id as string,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      about: user.about,
      gender: user.gender,
    };

    successResponse(res, "User fetched successfully", responseUser);
    return;
  } catch (error: any) {
    console.log("error", error);
    errorResponse(res, error.message, 500, error);
    return;
  }
};

const updateUser = async (req: any, res: any, next: any) => {
  const userId = req.authData.userId;
  const { fullName, username, about, gender } = req.body;
  try {
    const user = await getUserFromId(res, userId);
    if (!user) {
      errorResponse(res, "User not found", 404);
      return;
    }

    if (username) {
      const userWithUsername = await UserModel.findOne({ username });
      console.log("userWithUsername", userWithUsername);
      if (userWithUsername && userWithUsername.id !== user.id) {
        errorResponse(res, "Username already exists", 400);
        return;
      }
    }

    user.fullName = fullName ?? user.fullName;
    user.username = username ?? user.username;
    user.about = about ?? user.about;
    user.gender = gender ?? user.gender;

    await user.save();

    successResponse(res, "User updated successfully", user);
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

const checkUsername = async (req: any, res: any, next: any) => {
  const { username } = req.body;
  try {
    const user = await getUserFromUsername(res, username);
    if (user) {
      errorResponse(res, "Username already exists", 400);
      return;
    }
    successResponse(res, "Username is available", 200);
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

const updateAvatar = async (req: any, res: any, next: any) => {
  const userId = req.authData.userId;
  const { avatar } = req.body;
  try {
    if (!avatar) {
      errorResponse(res, "Avatar is required", 400);
      return;
    }
    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { avatar },
      { new: true }
    ).select("-password");
    if (!user) {
      errorResponse(res, "User not found", 404);
      return;
    }

    await user.save();
    successResponse(res, "Avatar updated successfully", user);
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

export default {
  getUserInfo,
  updateUser,
  checkUsername,
  updateAvatar,
};
