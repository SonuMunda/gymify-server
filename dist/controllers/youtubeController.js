var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { uploadVideoToYouTube } from "../services/youtubeService";
dotenv.config();
// Load environment variables
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI;
console.log("CLIENT_ID", CLIENT_ID);
console.log("CLIENT_SECRET", CLIENT_SECRET);
console.log("REDIRECT_URI", REDIRECT_URI);
export const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];
// For consent screen for youtube
export const getAuthUrl = () => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    return authUrl;
};
// gives us the tokens after the user has given consent
export const handleOAuthCallback = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const { tokens } = yield oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
});
const youtubeCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    console.log("code", code);
    if (!code) {
        return res.status(400).send("Authorization code not provided");
    }
    try {
        const tokens = yield handleOAuthCallback(code);
        res.status(200).json({ tokens, message: "OAuth tokens received" });
    }
    catch (error) {
        res.status(500).send("Failed to authenticate");
    }
});
const youtubeAuthUrl = (req, res) => {
    console.log("auth");
    const authUrl = getAuthUrl();
    res.redirect(authUrl);
};
const uploadVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename); // This is how we get the directory path in ES modules
        const videoPath = path.join(__dirname, "../Sonu_Tuchki.mp4");
        if (!fs.existsSync(videoPath)) {
            return res.status(404).send({ message: "Video file not found" });
        }
        const title = "Sonu Tuchki";
        const description = "Sonu Tuchki is a popular song by Tony";
        const response = yield uploadVideoToYouTube(videoPath, title, description);
        res.status(200).send({ message: "Video uploaded", data: response });
    }
    catch (error) {
        console.log("Error uploading video", error);
        res.status(500).send("Error uploading video");
    }
});
export { youtubeAuthUrl, youtubeCallback, uploadVideo };
