import { google } from "googleapis";
import fs from "fs";

const uploadVideoToYouTube = async (
  videoPath: string,
  title: string,
  description: string
) => {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: "your-access-token",
      refresh_token: "your-refresh-token",
    });
    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    console.log("Uploading video to YouTube...");

    // Get the file size to calculate progress
    const fileSize = fs.statSync(videoPath).size;
    let uploadedBytes = 0;

    // Upload the video and track progress
    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: title,
          description: description,
        },
        status: {
          privacyStatus: "unlisted",
        },
      },
      media: {
        body: fs.createReadStream(videoPath).on("data", (chunk) => {
          uploadedBytes += chunk.length;
          const progress = (uploadedBytes / fileSize) * 100;
          process.stdout.clearLine(null);
          process.stdout.cursorTo(0);
          process.stdout.write(`Uploading... ${Math.round(progress)}%`);
        }),
      },
    });

    // Print new line after upload completes
    process.stdout.write("\n");

    return response;
  } catch (error) {
    console.error("Error uploading video to YouTube:", error);
    throw error;
  }
};

export { uploadVideoToYouTube };
