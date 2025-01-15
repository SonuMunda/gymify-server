import { OneVOneChallenge, UserModel, VideoModel } from "../models/index.js";

import { errorResponse, successResponse } from "../utils/ResponseHelpers.js";
import { upload, uploadVideoToCloudinary } from "./cloudinaryService.js";
import { sendNotification } from "./notificationService.js";

interface ChallengeRequest {
  res: any;
  challengedBy: string;
  challengedTo: string;
  challengeName?: string;
  exerciseType: string;
}

const challengeAUserOneVOneService = async ({
  res,
  challengedBy,
  challengedTo,
  exerciseType,
}: ChallengeRequest) => {
  try {
    const users = await UserModel.find({
      _id: { $in: [challengedBy, challengedTo] },
    })
      .select("fullName")
      .lean();
    if (!users) {
      const message = "Users not found";
      errorResponse(res, message, 404);
      return;
    }
    const challengedByUser = users.find((user) =>
      user._id.equals(challengedBy)
    );

    const challengedToUser = users.find((user) =>
      user._id.equals(challengedTo)
    );

    if (!challengedByUser || !challengedToUser) {
      const message = "One or both users could not be found.";

      errorResponse(res, message, 404);
      return;
    }

    const challengeName = `${challengedByUser.fullName} vs ${challengedToUser.fullName} - 1v1`;

    const newChallenge = await OneVOneChallenge.create({
      challengedBy,
      challengeName,
      challengedTo,
      exerciseType,
    });

    if (!newChallenge) {
      const errorMessage =
        "Failed to create new challenge, please contact Naveen or Sonu";

      errorResponse(res, errorMessage, 404);
      return;
    }
    await newChallenge.save();

    const notificationMessage = `You have been challenged to a 1v1 in ${exerciseType.toUpperCase()} by ${challengedByUser.fullName?.toUpperCase()}`;

    const newNotification = await sendNotification({
      res,
      sender: challengedBy,
      recipient: challengedTo,
      type: "1v1 challenge",
      challengeId: newChallenge.id,
      message: notificationMessage,
    });

    if (!newNotification) {
      const errorMessage = "Failed to send notification to challenged user";

      errorResponse(res, errorMessage, 500);
      return;
    }

    return newChallenge && newNotification ? true : false;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

const acceptOneVOneChallengeService = async (
  res: any,
  req: any,
  challengeId: string
) => {
  try {
    const challenge = (await OneVOneChallenge.findById(challengeId).populate({
      path: "challengedTo",
      select: "fullName",
    })) as any;

    if (!challenge || !challenge.challengedTo || !challenge.challengedBy) {
      errorResponse(res, "Challenge not found or missing required data.", 404);
      return;
    }
    if (challenge.challengedTo.toString() !== req.authData.userId) {
      errorResponse(res, "You are not the challenged user", 401);
      return;
    }

    challenge.status = "accepted";
    challenge.reasonForRejection = "";
    await challenge.save();

    const notificationMessage = `Your challenge of ${
      challenge.exerciseType
    } has been accepted by ${challenge.challengedTo?.fullName?.toUpperCase()}`;

    const newNotification = await sendNotification({
      res,
      sender: challenge.challengedBy,
      recipient: challenge.challengedTo.id,
      type: "1v1",
      challengeId: challengeId,
      message: notificationMessage,
    });
    if (!newNotification) {
      errorResponse(res, "Failed to send notification to challenged user", 500);
      return;
    }
    await newNotification.save();

    return challenge;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

const rejectChallengeService = async (
  res: any,
  challengeId: string,
  reasonForRejection: string
) => {
  try {
    const challenge = (await OneVOneChallenge.findById(challengeId).populate({
      path: "challengedTo",
      select: "fullName",
    })) as any;

    if (!challenge || !challenge.challengedTo || !challenge.challengedBy) {
      errorResponse(res, "Challenge not found or missing required data.", 404);
      return;
    }

    challenge.status = "rejected";
    challenge.reasonForRejection = reasonForRejection || "";
    await challenge.save();

    const notificationMessage = `Your challenge of ${
      challenge.exerciseType
    } has been accepted by ${challenge.challengedTo?.fullName?.toUpperCase()}`;

    const newNotification = await sendNotification({
      res,
      sender: challenge.challengedBy,
      recipient: challenge.challengedTo.id,
      type: "1v1",
      challengeId: challengeId,
      message: notificationMessage,
    });
    if (!newNotification) {
      errorResponse(res, "Failed to send notification to challenged user", 500);
      return;
    }
    await newNotification.save();

    return challenge;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
}

const submitChallengeVideoService = async (
  req: any,
  res: any,
  challengeId: string,
  userId: string
) => {
  try {
    const challenge = await OneVOneChallenge.findById(challengeId);
    if (!challenge) {
      errorResponse(res, "Challenge not found", 404);
      return;
    }
    if (challenge.challengedBy.toString() !== userId) {
      errorResponse(res, "You are not the challenger", 401);
      return;
    }
    if (challenge.status !== "accepted") {
      errorResponse(res, "Challenge is not accepted yet", 400);
      return;
    }

    if (challenge.proofVideoUrl) {
      errorResponse(res, "You have already submitted a video", 400);
      return;
    }

    const uploadResult = await uploadVideoToCloudinary(req.file, res);
    if (!uploadResult) {
      errorResponse(res, "Failed to upload video", 500);
      return;
    }

    const video = await VideoModel.create({
      uploadedBy: userId,
      challengeId: challengeId,
      title: req.body.title || "Challenge Submission",
      description: req.body.description || "",
      category: "challenge submission",
      cloudinaryUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      size: uploadResult.bytes,
      format: uploadResult.format,
      status: "pending",
    });
    await video.save();

    if (!video) {
      errorResponse(res, "Failed to create video record", 500);
      return;
    }

    challenge.proofVideoUrl = uploadResult.secure_url;

    await challenge.save();

    return video;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

export {
  challengeAUserOneVOneService,
  acceptOneVOneChallengeService,
  rejectChallengeService,
  submitChallengeVideoService,
};
