import { ChallengeModel } from "../models/index.js";
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

/**
 * @swagger
 * /v1/user/create-challenge:
 *  post:
 *  description: Create a new challenge
 * tags:
 * - User
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * challengeName:
 * type: string
 * challengeType:
 * type: string
 * exerciseType:
 * type: string
 * challengerId:
 * type: string
 * challengedUserId:
 * type: string
 * required:
 * - challengeName
 * - challengeType
 * - exerciseType
 * - challengerId
 * - challengedUserId
 * responses:
 * 200:
 * description: Challenge created successfully
 * 400:
 * description: Error
 * 401:
 * description: Unauthorized
 */

const createChallenge = async (req, res, next) => {
  const userId = req.authData.userId;
  const {
    challengeName,
    challengeType,
    exerciseType,
    challengerId,
    challengedUserId,
  } = req.body;
  try {
    const user = await getUserFromId(userId);
    const challenge = new ChallengeModel({
      challengeName,
      challengeType,
      exerciseType,
      challengerId,
      challengedUserId,
    });
    await challenge.save();
    res.status(200).json({ challenge });
  } catch (error) {
    next(error);
  }
};

export default {
  getUserInfo,
  updateUser,
  checkUsername,
  updateAvatar,
  createChallenge,
};


