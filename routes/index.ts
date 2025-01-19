import express from "express";

import authRoute from "./authRoute";
import userRoute from "./userRoute";
import challengesRoute from "./challengesRoute";
import userStatisticsRoute from "./userStatisticsRoute"

const router = express.Router();

router.get("/status", (req, res) => {
  res.json({
    status: "ok",
    processEnv: process.env.NODE_ENV || "not set",
    CURRENT_PROJECT: process.env.CURRENT_PROJECT,
  });
});

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/challenges", challengesRoute);
router.use("/statistics",userStatisticsRoute )

export default router;
