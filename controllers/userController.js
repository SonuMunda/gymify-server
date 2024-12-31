import challengeAUserService from "../services/challangeAUserService.js";
import { getUserFromId, getUserFromUsername } from "../services/userService.js";

const getUserInfo = async (req, res, next) => {
  const userId = req.authData.userId;
  try {
    const user = await getUserFromId(userId);
    const responseUser = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      about: user.about,
    };
    console.log("responseUser", responseUser);
    res.status(200).json({ user: responseUser });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const userId = req.authData.userId;
  const { fullName, username, about } = req.body;
  try {
    console.log("userId", userId);

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
    return res.status(200).json({
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

const challengeAUser = async (req, res, next) => {
  const {
    challengedBy,
    challengedTo,
    challengeName,
    challengeType,
    exerciseType,
  } = req.body;

  try {
    const [challengedByUserExists, challengedToUserExists] = await Promise.all([
      getUserFromId(challengedBy),
      getUserFromId(challengedTo),
    ]);

    if (!challengedByUserExists || !challengedToUserExists) {
      return res.status(400).json({ message: "One or both users not found." });
    }

    const challenge = await challengeAUserService({
      challengedBy,
      challengedTo,
      challengeName,
      challengeType,
      exerciseType,
    });

    res.status(200).json({ message: "Challenge sent", challenge });
  } catch (error) {
    next(error);
  }
};

export default {
  getUserInfo,
  updateUser,
  checkUsername,
  updateAvatar,
  challengeAUser,
};
