import express from "express";

import { isActiveUser } from "../middlewares/isActiveUser";
import {
  getSubmittedChallengesByVerificationStatus,
  updateSubmittedChallengeVerificationStatus,
} from "../controllers/adminController";
// @ts-ignore
import trimRequest from "trim-request";
import { checkRole } from "../middlewares/checkRole";

const router = express.Router();

router
  .route("/challenges")
  .get(
    trimRequest.all,
    isActiveUser,
    checkRole("admin"),
    getSubmittedChallengesByVerificationStatus
  );

router
  .route("/challenges/verify")
  .put(
    trimRequest.all,
    isActiveUser,
    checkRole("admin"),
    updateSubmittedChallengeVerificationStatus
  );

export default router;
