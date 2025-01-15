import cloudinary from "../utils/cloudinary";
import multer from "multer";
import { errorResponse } from "../utils/ResponseHelpers";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import os from "os";

// Promisify fs functions
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

type CloudinaryResponse = {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
};

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files are allowed"));
    }
    cb(null, true);
  },
}).single("video");

const compressVideo = async (
  res: any,
  inputPath: string,
  outputPath: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec("libx264")
      .audioCodec("aac")
      .size("640x?")
      .audioBitrate("128k")
      .videoBitrate("1024k")
      .fps(30)
      .format("mp4")
      .outputOptions(["-preset medium", "-movflags +faststart"])
      .on("start", (commandLine) => {
        console.log("Started ffmpeg with command:", commandLine);
      })
      .on("progress", (progress) => {
        console.log(
          "Processing: ",
          progress.percent ? Math.round(progress.percent) : 0,
          "% done"
        );
      })
      .on("end", () => {
        console.log("Compression finished");
        resolve();
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err);
        errorResponse(res, "Failed to compress video", 500, err);
        return;
      })
      .save(outputPath);
  });
};

const generateCleanFilename = (originalName: string): string => {
  console.log("Original name:", originalName);
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");

  const cleanName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  console.log("Clean name:", cleanName);
  return `challenge-${cleanName}-${Date.now()}`;
};

const uploadVideoToCloudinary = async (
  file: Express.Multer.File,
  res: any
): Promise<CloudinaryResponse | void> => {
  console.log("File size original", file.size / (1024 * 1024), "MB");
  const tempInputPath = path.join(os.tmpdir(), `input-${Date.now()}.mp4`);
  const tempOutputPath = path.join(os.tmpdir(), `output-${Date.now()}.mp4`);

  try {
    console.log("File size original", file.size / (1024 * 1024), "MB");
    console.log("Starting video upload process");

    await writeFile(tempInputPath, file.buffer);
    console.log("Temporary input file created");

    console.log("Compressing video...");
    await compressVideo(res, tempInputPath, tempOutputPath);

    const compressedBuffer = await fs.promises.readFile(tempOutputPath);
    console.log(
      "Compression complete. Compressed size:",
      compressedBuffer.length / (1024 * 1024),
      "MB"
    );

    console.log("Uploading video to Cloudinary...");
    const cleanFilename = generateCleanFilename(file.originalname);

    const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "video",
            folder: "challenges",
            public_id: cleanFilename,
            upload_preset: "gymify",
            unique_filename: true,
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              resolve(result as CloudinaryResponse);
            }
          }
        )
        .end(compressedBuffer);
    });
    if (!result) {
      errorResponse(res, "Failed to upload video", 500);
      return;
    }

    return result;
  } catch (error: any) {
    console.error("Upload error:", error);
    if (!res.headersSent) {
      errorResponse(
        res,
        `Failed to upload video: ${error.message}`,
        error.http_code || 500
      );
      return;
    }
    throw error;
  } finally {
    console.log("Cleaning up temporary files...");
    try {
      await unlink(tempInputPath).catch(() => {});
      await unlink(tempOutputPath).catch(() => {});
      console.log("Temporary files cleaned up");
    } catch (err: any) {
      errorResponse(
        res,
        `Failed to clean up temporary files: ${err.message}`,
        500,
        err
      );
      return;
    }
  }
};

export { upload, uploadVideoToCloudinary };
