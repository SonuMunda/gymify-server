import express from "express";
import { uploadVideo, youtubeAuthUrl, youtubeCallback, } from "../controllers/youtubeController.js";
const router = express.Router();
router.get("/auth", youtubeAuthUrl);
router.get("/callback", youtubeCallback);
router.post("/upload", uploadVideo);
export default router;
