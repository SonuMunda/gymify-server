import express from "express";
import { isActiveUser } from "../middlewares/isActiveUser";
import {
  getUserStatistics,
  updateUserExcerciseLog,
  updateUserStatistics,
} from "../controllers/userStatisticsController";
import userStatisticsValidations from "../validations/userStatisticsValidations";
import validate from "../utils/yupValidations";
// @ts-ignore
import trimRequest from "trim-request";


const router = express.Router();

router.get("/info", trimRequest.all, isActiveUser, getUserStatistics);
router.put(
  "/update",
  trimRequest.all,
  isActiveUser,
  updateUserStatistics
);
router.post(
  "/update-log",
  trimRequest.all,
  isActiveUser,
  validate(userStatisticsValidations.updateExerciseSchema),
  updateUserExcerciseLog
);

export default router;
