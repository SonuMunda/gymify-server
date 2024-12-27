import { getUserFromId, getUserFromUsername } from "../services/userService.js";

const getUserInfo = async (req, res, next) => {
  const userId = req.authData.userId;
  try {
    const user = await getUserFromId(userId);
    const responseUser = {
      id: user._id,
      email: user.email,
    };
    res.status(200).json({ user: responseUser });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
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

const checkUsername = async (req, res, next) => {
  const { username } = req.body;
  try {
    const user = await getUserFromUsername(username);
    res.status(200).json({
      available: !user,
      message: user ? "Username already exists" : "Username is available",
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
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
