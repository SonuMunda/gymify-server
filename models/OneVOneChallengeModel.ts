import mongoose, { Document, Schema } from "mongoose";

// export interface IOneVOneChallenge extends Document {
//   challengeName: string;
//   exerciseType: string;
//   challengedBy: string;
//   challengedTo: string;
//   status: string;
//   isCompleted: boolean;
//   verificationStatus: string;
//   verifiedAt?: Date;
//   completedAt?: Date;
//   proofVideoUrl?: string;
//   winnerId?: mongoose.Schema.Types.ObjectId;
//   rewardPoints: number;
//   createdAt: Date;
//   reasonForRejection?: string;
// }

const OneVOneChallengeSchema = new Schema(
  {
    challengedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challengeName: {
      type: String,
      required: true,
    },
    challengedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exerciseType: {
      type: String,
      required: true,
      enum: ["bench press", "squat", "deadlift"],
    },
    // if challengedTo user accepts the challenge, status will be "accepted"
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    },
    // if the submitted video is veriffeid challenge is completed, isCompleted will be true
    isCompleted: {
      type: Boolean,
      default: false,
    },
    // for admin to verify the challenge
    verificationStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "verified", "rejected"],
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
    reasonForRejection: {
      type: String,
    },
  },
  { timestamps: true }
);

const OneVOneChallenge = mongoose.model(
  "OneVOneChallenge",
  OneVOneChallengeSchema
);

export default OneVOneChallenge;
