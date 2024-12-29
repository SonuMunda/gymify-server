import { getUserFromId, getUserFromUsername } from "../services/userService.js";
import { IUser } from "../models/UserModel.js";

const getUserInfo = async (req: any, res: any, next: any) => {
  const userId = req.authData.userId;
  try {
    console.log("userId", userId);
    const user = await getUserFromId(userId);
    console.log("user", user);
    const responseUser = {
      id: user.id as string,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      about: user.about,
    };

    res.status(200).json({ user: responseUser });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

const updateUser = async (req: any, res: any, next: any) => {
  const userId = req.authData.userId;
  const { fullName, username, about } = req.body;
  try {
    const user = await getUserFromId(userId);

    Object.assign(user, { fullName, username, about });

    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const checkUsername = async (req: any, res: any, next: any) => {
  const { username } = req.body;
  try {
    const user: IUser | null = await getUserFromUsername(username);
    return res.status(200).json({
      available: !user,
      message: user ? "Username already exists" : "Username is available",
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req: any, res: any, next: any) => {
  const userId = req.authData.userId;
  const { avatar } = req.body;
  try {
    const user = await getUserFromId(userId);
    user.avatar = avatar;

    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export default {
  getUserInfo,
  updateUser,
  checkUsername,
  updateAvatar,
};
