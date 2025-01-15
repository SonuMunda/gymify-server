import express from "express";
import { isActiveUser } from "../middlewares/isActiveUser";
import validate from "../utils/yupValidations";
import controller from "../controllers/userController";
// @ts-ignore
import trimRequest from "trim-request";
import schemas from "../validations/userValidations";

const router = express.Router();

router.get("/info", trimRequest.all, isActiveUser, controller.getUserInfo);

router.put(
  "/update",
  trimRequest.all,
  isActiveUser,
  validate(schemas.updateProfileSchema),
  controller.updateUser
);

router.post(
  "/check-username",
  trimRequest.all,
  isActiveUser,
  validate(schemas.checkUsernameSchema),
  controller.checkUsername
);

router.put(
  "/update-avatar",
  trimRequest.all,
  isActiveUser,
  validate(schemas.updateAvatarSchema),
  controller.updateAvatar
);

export default router;
