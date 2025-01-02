import mongoose, { Document, Schema } from "mongoose";


interface IOneVOneChallenge extends Document {
  challengeName: string;
  challengeType: string;
  exerciseType: string;
  challengedBy: mongoose.Schema.Types.ObjectId;
  challengedTo: mongoose.Schema.Types.ObjectId;
  challangeStatus: string;
  isCompleted: boolean;
  verificationStatus: string;
  verifiedAt?: Date;
  completedAt?: Date;
  proofVideoUrl?: string;
  winnerId?: mongoose.Schema.Types.ObjectId;
  rewardPoints: number;
  createdAt: Date;
}

const OneVOneChallengeSchema = new Schema<IOneVOneChallenge>(
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


const OneVOneChallenge = mongoose.model<IOneVOneChallenge>(
  "OneVOneChallenge",
  OneVOneChallengeSchema
);

export default OneVOneChallenge;