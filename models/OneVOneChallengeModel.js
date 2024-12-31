import mongoose from "mongoose";

const OneVOneChallengeSchema = new mongoose.Schema(
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
      enum: ["bench press", "squat", "deadlift"],
    },
    challengedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challengedTo: {
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

const OneVOneChallenge = mongoose.model("OneVOneChallengeeModel", OneVOneChallengeSchema);

export default OneVOneChallenge;