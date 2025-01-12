import {
  challengeAUserOneVOneService,
  acceptOneVOneChallengeService,
  rejectChallengeService,
} from "../services/challengesService";

import { errorResponse, successResponse } from "../utils/ResponseHelpers";
import { OneVOneChallenge } from "../models";

const getUserChallenges = async (req: any, res: any): Promise<void> => {
  const userId = req.authData.userId; // Get the user ID from the request

  if (!userId) errorResponse(res, "Unauthorized", 401);

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
    }

    successResponse(res, "Challenges fetched successfully", {
      sentChallenges,
      receivedChallenges,
    });
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
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
    successResponse(res, "User challenged successfully", result, 200);
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
  }
};

const acceptOneVOneChallenge = async (req: any, res: any): Promise<void> => {
  const { challengeId } = req.body;

  try {
    const challenge = await acceptOneVOneChallengeService(res, challengeId);
    if (!challenge) {
      errorResponse(
        res,
        "Failed to accept challenge,Please contact Naveen or Sonu",
        400
      );
      return;
    }
    successResponse(res, "Challenge accepted", challenge, 200);
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
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
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
  }
};

export {
  getUserChallenges,
  challengeAUserOneVOne,
  acceptOneVOneChallenge,
  rejectChallenge,
};
