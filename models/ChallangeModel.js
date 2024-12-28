const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema(
  {
    challengeName: {
      type: String,
      required: true,
    },
    challengeType: {
      type: String,
      required: true,
    },
    exerciseType: {
      type: String,
      required: true,
    },
    challengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challengedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challangeStatus: {
      type: String,
      default: "pending",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      default: "pending",
    },
    verifiedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    proofVideoUrl: {
      type: String,
    },
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rewardPoints: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Challenge = mongoose.model("ChallengeModel", ChallengeSchema);

module.exports = ChallengeModel;
