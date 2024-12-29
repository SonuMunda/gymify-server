import express from "express";
import { isActiveUser } from "../middlewares/isActiveUser.js";
import validate from "../utils/yupValidations.js";
import controller from "../controllers/userController.js";
import trimRequest from "trim-request";
import schemas from "../validations/userValidations.js";

const router = express.Router();

/**
 * @swagger
 * /v1/user/info:
 *   get:
 *     description: Get information about the logged-in user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *       401:
 *         description: Unauthorized, user not logged in
 */
router.get("/info", trimRequest.all, isActiveUser, controller.getUserInfo);

/**
 * @swagger
 * /v1/user/update:
 *   put:
 *     description: Update user profile
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               about:
 *                 type: string
 *               username:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized, user not logged in
 */
router.put(
  "/update",
  trimRequest.all,
  isActiveUser,
  validate(schemas.updateProfileSchema),
  controller.updateUser
);

/**
 * @swagger
 * /v1/user/check-username:
 *   post:
 *     description: Check if the username is available
 *     tags:
 *       - User
 *    security:
 *      - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *             required:
 *               - username
 *     responses:
 *       200:
 *         description: Username is available
 *       400:
 *         description: Invalid username
 */
router.post(
  "/check-username",
  trimRequest.all,
  isActiveUser,
  validate(schemas.checkUsernameSchema),
  controller.checkUsername
);

/**
 * @swagger
 * /v1/user/update-avatar:
 *   put:
 *     description: Update the avatar for the user
 *     tags:
 *       - User
 *    security:
 *     - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *             required:
 *               - avatar
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *       400:
 *         description: Invalid avatar data
 *       401:
 *         description: Unauthorized, user not logged in
 */
router.put(
  "/update-avatar",
  trimRequest.all,
  isActiveUser,
  validate(schemas.updateAvatarSchema),
  controller.updateAvatar
);

/**
 * @swagger
 * /v1/user/create-challenge:
 *  post:
 *  description: Create a new challenge
 *  tags:
 *   - User
 * security:
 *  - BearerAuth: []
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
 * challengerUserId:
 * type: string
 * challengedUserId:
 * type: string
 * required:
 * - challengeName
 * - challengeType
 * - exerciseType
 * - challengerUserId
 * - challengedUserId
 * responses:
 * 200:
 * 
 * description: Challenge created successfully
 * 400:
 * description: Invalid challenge data
 * 401:
 * description: Unauthorized, user not logged in
 */

router.post(
  "/create-challenge",
  trimRequest.all,
  isActiveUser,
  validate(schemas.createChallengeSchema),
  controller.createChallenge
);


export default router;
