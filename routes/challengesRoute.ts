import express from "express";
// @ts-ignore
import trimRequest from "trim-request";
import controller from "../controllers/challengeController";
import challengesValidationSchema from "../validations/challangesValidations";
import { isActiveUser } from "../middlewares/isActiveUser";
import validate from "../utils/yupValidations";

const router = express.Router();

/**
 * @swagger
 * /v1/challenges/challenge-user:
 *   post:
 *     description: Challenge a user for a 1v1 challenge
 *     tags:
 *       - Challanges
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               challengedBy:
 *                 type: string
 *               challengedTo:
 *                 type: string
 *               challengeName:
 *                 type: string
 *               challengeType:
 *                 type: string
 *               exerciseType:
 *                 type: string
 *             required:
 *               - challengedBy
 *               - challengedTo
 *               - challengeName
 *               - challengeType
 *               - exerciseType
 *     responses:
 *       200:
 *         description: User challenged successfully
 *       400:
 *         description: Invalid challenge data
 *       401:
 *         description: Unauthorized, user not logged in
 */
router.post(
  "/challenge-user",
  trimRequest.all,
  isActiveUser,
  validate(challengesValidationSchema.challengeAUser),
  controller.challengeAUser
);

/**
 * @swagger
 * /v1/challenges/accept-challenge:
 *   post:
 *     description: Accept a challenge
 *     tags:
 *       - Challanges
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               challengeId:
 *                 type: string
 *             required:
 *               - challengeId
 *     responses:
 *       200:
 *         description: Challenge accepted
 *       400:
 *         description: Invalid challenge data
 *       401:
 *         description: Unauthorized, user not logged in
 */

router.post(
  "/accept-challenge",
  trimRequest.all,
  isActiveUser,
  validate(challengesValidationSchema.acceptChallenge),
  controller.acceptChallenge
);

/**
 * @swagger
 * /v1/challenges/reject-challenge:
 *   post:
 *     description: Reject a challenge
 *     tags:
 *       - Challanges
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               challengeId:
 *                 type: string
 *             required:
 *               - challengeId
 *     responses:
 *       200:
 *         description: Challenge rejected
 *       400:
 *         description: Invalid challenge data
 *       401:
 *         description: Unauthorized, user not logged in
 */

router.post(
  "/reject-challenge",
  trimRequest.all,
  isActiveUser,
  validate(challengesValidationSchema.rejectChallenge),
  controller.rejectChallenge
);

export default router;
