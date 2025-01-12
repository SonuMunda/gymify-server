import { OneVOneChallenge, UserModel } from "../models/index.js";

import { errorResponse } from "../utils/ResponseHelpers.js";
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
      .select("name")
      .lean();

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
      errorResponse(
        res,
        "Failed to create new challenge,please contact Naveen or Sonu",
        404
      );
      return;
    }
    await newChallenge.save();

    const notificationMessage = `You have been challenged to a 1v1 in ${exerciseType.toUpperCase()} by ${challengedByUser.fullName?.toUpperCase()}`;
    const newNotification = await sendNotification({
      res,
      sender: challengedBy,
      recipient: challengedTo,
      type: "1v1",
      challengeId: newChallenge.id,
      message: notificationMessage,
    });
    if (!newNotification) {
      errorResponse(res, "Failed to send notification to challenged user", 500);
      return;
    }
    await newNotification.save();

    return newChallenge.id && newNotification.id ? true : false;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
  }
};

const acceptOneVOneChallengeService = async (res: any, challengeId: string) => {
  try {
    const challenge = (await OneVOneChallenge.findById(challengeId).populate({
      path: "challengedTo",
      select: "fullName",
    })) as any;
    console.log(challenge);

    if (!challenge || !challenge.challengedTo || !challenge.challengedBy) {
      errorResponse(res, "Challenge not found or missing required data.", 404);
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
    console.log(challenge);

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
  }
};

export {
  challengeAUserOneVOneService,
  acceptOneVOneChallengeService,
  rejectChallengeService,
};
