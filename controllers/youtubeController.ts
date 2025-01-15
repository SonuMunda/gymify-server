import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { uploadVideoToYouTube } from "../services/youtubeService";
import { errorResponse, successResponse } from "../utils/ResponseHelpers";

dotenv.config();

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI;

export const oauth2Client = new OAuth2Client(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];

export const getAuthUrl = () => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  return authUrl;
};

export const handleOAuthCallback = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

const youtubeCallback = async (req: any, res: any) => {
  const code = req.query.code;

  if (!code) {
    errorResponse(res, "No code provided", 400);
  }

  try {
    const tokens = await handleOAuthCallback(code);
    successResponse(res, "Authenticated successfully", tokens);
  } catch (error: any) {
    errorResponse(res, "Error authenticating", 500, error);
    return;
  }
};

const youtubeAuthUrl = (req: any, res: any) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
};

const uploadVideo = async (req: any, res: any) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const videoPath = path.join(__dirname, "../Sonu_Tuchki.mp4");
    if (!fs.existsSync(videoPath)) {
      errorResponse(res, "Video file not found", 400);
      return;
    }

    const title = "Sonu Tuchki";
    const description = "Sonu Tuchki is a popular song by Tony";
    const response = await uploadVideoToYouTube(
      res,
      videoPath,
      title,
      description
    );
    successResponse(res, "Video uploaded successfully", response);
    return;
  } catch (error: any) {
    console.log("Error uploading video", error);
    errorResponse(res, "Error uploading video", 500, error);
    return;
  }
};
export { youtubeAuthUrl, youtubeCallback, uploadVideo };
