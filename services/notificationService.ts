import NotificationModel from "../models/NotificationModel";
import { errorResponse } from "../utils/ResponseHelpers";

interface NotificationRequest {
  res?: any;
  recipient: string;
  sender?: string;
  type: string;
  message: string;
  challengeId?: string;
  videoId?: string;
}

export const sendNotification = async ({
  res,
  recipient,
  sender,
  type,
  message,
  challengeId,
  videoId,
}: NotificationRequest) => {
  try {
    const notificationData: any = {
      recipient,
      type,
      message,
    };

    if (sender) {
      notificationData.sender = sender;
    }
    if (challengeId) {
      notificationData.challengeId = challengeId;
    }
    if (videoId) {
      notificationData.videoId = videoId;
    }

    const newNotification = await NotificationModel.create(notificationData);

    if (!newNotification) {
      errorResponse(res, "Failed to send notification", 500);
      return;
    }
    await newNotification.save();
    return newNotification.id;
  } catch (error: Error | any) {
    console.error("Error sending notification:", error);
    errorResponse(res, "Failed to send notification", 500, error);
  }
};
