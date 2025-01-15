import {
  challengeAUserOneVOneService,
  acceptOneVOneChallengeService,
  rejectChallengeService,
  submitChallengeVideoService,
} from "../services/challengesService";

import { errorResponse, successResponse } from "../utils/ResponseHelpers";
import { OneVOneChallenge } from "../models";

const getUserChallenges = async (req: any, res: any): Promise<void> => {
  const userId = req.authData.userId;

  if (!userId) {
    errorResponse(res, "Unauthorized", 401);
    return;
  }

  try {
    const challenges = await OneVOneChallenge.find({
      $or: [{ challengedBy: userId }, { challengedTo: userId }],
    })
      .populate("challengedBy", "fullName _id")
      .populate("challengedTo", "fullName _id")
      .lean();

    const sentChallenges = challenges.filter(
      (challenge) => challenge.challengedBy._id.toString() === userId
    );
    const receivedChallenges = challenges.filter(
      (challenge) => challenge.challengedTo._id.toString() === userId
    );
    if (!sentChallenges.length && !receivedChallenges.length) {
      successResponse(res, "No challenges found", {
        sentChallenges,
        receivedChallenges,
      });
      return;
    }

    successResponse(res, "Challenges fetched successfully", {
      sentChallenges,
      receivedChallenges,
    });
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};
const challengeAUserOneVOne = async (req: any, res: any): Promise<void> => {
  const { challengedTo, exerciseType } = req.body;

  const userId = req?.authData?.userId;

  if (!userId) {
    errorResponse(res, "Unauthorized", 401);
    return;
  }
  try {
    if (challengedTo === userId) {
      errorResponse(res, "You can't challenge yourself", 400);
      return;
    }

    const result = await challengeAUserOneVOneService({
      res,
      challengedBy: userId,
      challengedTo,
      exerciseType,
    });
    if (!result) {
      errorResponse(res, "Failed to challenge a user", 500);
      return;
    }

    successResponse(res, "User challenged successfully", { id: result }, 200);
    return;
  } catch (error: any) {
    console.log("Error occurred:", error.message);
    errorResponse(res, error.message, 500, error);
    return;
  }
};

const acceptOneVOneChallenge = async (req: any, res: any): Promise<void> => {
  const { challengeId } = req.body;

  try {
    const challenge = await acceptOneVOneChallengeService(
      res,
      req,
      challengeId
    );
    if (!challenge) {
      errorResponse(
        res,
        "Failed to accept challenge,Please contact Naveen or Sonu",
        400
      );
      return;
    }
    successResponse(res, "Challenge accepted", challenge, 200);
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

const rejectChallenge = async (req: any, res: any): Promise<void> => {
  const { challengeId, reasonForRejection } = req.body;

  try {
    const challenge = await rejectChallengeService(
      res,
      challengeId,
      reasonForRejection
    );

    if (!challenge) {
      errorResponse(
        res,
        "Failed to reject challenge,Please contact Naveen or Sonu",
        400
      );
      return;
    }

    successResponse(res, "Challenge rejected", challenge, 200);
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

const submitChallengeVideo = async (req: any, res: any): Promise<void> => {
  const { challengeId, title, description, video, file } = req.body;
  const userId = req?.authData?.userId;
  if (!userId) {
    errorResponse(res, "Unauthorized", 401);
    return;
  }

  if (!req.file) {
    errorResponse(res, "No file uploaded", 400);
    return;
  }

  try {
    if (!title || !description) {
      errorResponse(res, "Title and description are required", 400);
      return;
    }
    const result = await submitChallengeVideoService(
      req,
      res,
      challengeId,
      userId
    );
    if (!result) {
      errorResponse(res, "Failed to submit challenge video", 500);
      return;
    }

    successResponse(res, "Challenge video submitted successfully", result, 200);
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

export {
  getUserChallenges,
  submitChallengeVideo,
  challengeAUserOneVOne,
  acceptOneVOneChallenge,
  rejectChallenge,
};
