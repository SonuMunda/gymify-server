import express from "express";
import multer from "multer";
import authRoute from "./authRoute";
import userRoute from "./userRoute";
import challengesRoute from "./challengesRoute";
import { upload, uploadVideoToCloudinary } from "../services/cloudinaryService";
import { isActiveUser } from "../middlewares/isActiveUser";
// @ts-ignore
import trimRequest from "trim-request";
import VideoModel from "../models/VideoModel";
import { checkRole } from "../middlewares/checkRole";

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

// Upload video to Cloudinary
router.post(
  "/upload-video-cloudinary",
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer error handling
        return res.status(400).json({
          error: `Upload error: ${err.message}`,
          type: "MULTER_ERROR",
        });
      } else if (err) {
        // Other errors
        return res.status(400).json({
          error: err.message,
          type: "UPLOAD_ERROR",
        });
      }
      next();
    });
  },
  trimRequest.all,
  isActiveUser,
  async (req: any, res: any, next: any) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req?.authData?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      console.log("Uploading video to Cloudinary...");
      const uploadResult = await uploadVideoToCloudinary(req.file);
      console.log("uploadResult", uploadResult);
      const video = await VideoModel.create({
        uploadedBy: userId,
        cloudinaryUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });

      await video.save();

      return res
        .status(200)
        .json({ message: "Video uploaded successfully", video });
    } catch (error: any) {
      console.error("Error uploading video:", error);
      return res.status(500).json({
        error: error.message,
        type: "CLOUDINARY_ERROR",
      });
    }
  }
);

// Get all videos from Cloudinary
router.get(
  "/get-all-videos",
  trimRequest.all,
  isActiveUser,
  checkRole("admin"),
  async (req: any, res: any, next: any) => {
    try {
      const videos = await VideoModel.find({ userId: req?.authData?.userId });
      return res.status(200).json({ videos });
    } catch (error: any) {
      console.error("Error getting videos:", error);
      return next(error);
    }
  }
);

export default router;
