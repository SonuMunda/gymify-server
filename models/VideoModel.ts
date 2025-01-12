import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OneVOneChallenge",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      enum: ["challenge submission", "stats", "other"],
    },
    cloudinaryUrl: {
      type: String,
    },
    youtubeUrl: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    videoThumbnail: { type: String },
    size: {
      type: Number,
    },
    format: {
      type: String,
      enum: ["mp4", "mov", "avi", "wmv"],
    },
    duration: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const VideoModel = mongoose.model("Video", videoSchema);

export default VideoModel;
