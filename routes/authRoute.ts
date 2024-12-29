import express from "express";
import { isActiveUser } from "../middlewares/isActiveUser.js";
import validate from "../utils/yupValidations.js";
import controller from "../controllers/authController.js";
import trimRequest from "trim-request";
import schemas from "../validations/authValidations.js";

const router = express.Router();

/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     description: Register a new user with email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid registration data
 */
router
  .route("/register")
  .post(trimRequest.all, validate(schemas.registerSchema), controller.register);
/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     description: User login with email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */
router
  .route("/login")
  .post(trimRequest.all, validate(schemas.loginSchema), controller.login);

/**
 * @swagger
 * /v1/auth/logout:
 *   post:
 *     description: User logout and invalidate the refresh token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: Invalid refresh token
 */
router
  .route("/logout")
  .post(trimRequest.all, validate(schemas.logoutSchema), controller.logout);

/**
 * @swagger
 * /v1/auth/refresh-token:
 *   post:
 *     description: Refresh access token using a valid refresh token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *       400:
 *         description: Invalid refresh token
 */
router
  .route("/refresh-token")
  .post(
    trimRequest.all,
    validate(schemas.refreshTokenSchema),
    controller.refreshToken
  );

/**
 * @swagger
 * /v1/auth/reset-password:
 *   post:
 *     description: Reset user password
 *     tags:
 *       - Authentication
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - password
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid password or token
 */
router
  .route("/reset-password")
  .post(
    trimRequest.all,
    validate(schemas.resetPasswordSchema),
    isActiveUser,
    controller.resetPassword
  );

/**
 * @swagger
 * /v1/auth/google-register:
 *   post:
 *     description: Register a new user using Google OAuth token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *             required:
 *               - token
 *     responses:
 *       201:
 *         description: Google user registered successfully
 *       400:
 *         description: Invalid Google token
 */
router
  .route("/google-register")
  .post(
    trimRequest.all,
    validate(schemas.googleUserSchema),
    controller.googleUserRegister
  );

/**
 * @swagger
 * /v1/auth/google-login:
 *   post:
 *     description: Login user using Google OAuth token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *             required:
 *               - token
 *     responses:
 *       200:
 *         description: Google user logged in successfully
 *       400:
 *         description: Invalid Google token
 */
router
  .route("/google-login")
  .post(
    trimRequest.all,
    validate(schemas.googleUserSchema),
    controller.googleUserLogin
  );

export default router;
