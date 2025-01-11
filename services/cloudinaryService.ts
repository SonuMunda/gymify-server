import cloudinary from "../utils/cloudinary";
import multer from "multer";
// Configure multer with size limits and file validation
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

const uploadVideoToCloudinary = async (file: Express.Multer.File) => {
  if (!file.buffer) {
    throw new Error("No file buffer found");
  }

  console.log("Starting video upload process");

  const chunkSize = 5 * 1024 * 1024; // 5MB chunks
  const chunks = [];
  for (let i = 0; i < file.buffer.length; i += chunkSize) {
    chunks.push(file.buffer.slice(i, i + chunkSize).toString("base64"));
  }
  const base64Data = chunks.join("");

  console.log("File converted to base64");

  try {
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${base64Data}`,
      {
        resource_type: "video",
        public_id: `video-${file.originalname}-${Date.now()}`,
        folder: "challenges",
        allowed_formats: ["mp4", "mov", "avi"],
        unique_filename: true,
        upload_preset: "gymify",
        chunk_size: 6000000,
        timeout: 120000,
      }
    );
    console.log("Video uploaded successfully:", result);
    return result;
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Video upload failed: ${error.message}`);
  }
};
export { upload, uploadVideoToCloudinary };
