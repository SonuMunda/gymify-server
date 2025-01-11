import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    youtubeUrl: {
      type: String,
    },
    videoName: {
      type: String,
    },
    cloudinaryUrl: {
      type: String,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
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

const VideoModel = mongoose.model("VideoSchema", videoSchema);

export default VideoModel;
