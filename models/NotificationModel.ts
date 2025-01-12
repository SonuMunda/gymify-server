import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  recipient: mongoose.Schema.Types.ObjectId;
  sender?: mongoose.Schema.Types.ObjectId;
  type: string;
  message: string;
  status: string;
  challengeId?: mongoose.Schema.Types.ObjectId;
  videoId?: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "1v1 challenge",
        "general",
        "video submission",
        "approval",
        "rejection",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OneVOneChallenge",
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);

export default NotificationModel;
