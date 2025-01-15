import express from "express";
// @ts-ignore
import trimRequest from "trim-request";
import {
  acceptOneVOneChallenge,
  getUserChallenges,
  challengeAUserOneVOne,
  rejectChallenge,
  submitChallengeVideo,
} from "../controllers/challengeController";
import challengesValidationSchema from "../validations/challangesValidations";
import { isActiveUser } from "../middlewares/isActiveUser";
import validate from "../utils/yupValidations";
import { upload } from "../services/cloudinaryService";
import multer from "multer";
import { errorResponse } from "../utils/ResponseHelpers";

const router = express.Router();

router.post(
  "/submit-challenge-video",
  trimRequest.all,
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        errorResponse(res, err.message, 400, err);
        return;
      } else if (err) {
        errorResponse(res, err.message, 400, err);
        return;
      }
      next();
    });
  },
  isActiveUser,
  submitChallengeVideo
);

router.get(
  "/getuserchallenges",
  trimRequest.all,
  isActiveUser,
  getUserChallenges
);

router.post(
  "/challenge-user",
  trimRequest.all,
  isActiveUser,
  validate(challengesValidationSchema.challengeAUserOneVOne),
  challengeAUserOneVOne
);

router.post(
  "/accept-challenge",
  trimRequest.all,
  isActiveUser,
  validate(challengesValidationSchema.acceptOneVOneChallenge),
  acceptOneVOneChallenge
);

router.post(
  "/reject-challenge",
  trimRequest.all,
  isActiveUser,
  validate(challengesValidationSchema.rejectChallenge),
  rejectChallenge
);

export default router;
