import { Request, Response, NextFunction } from "express";
import {
  challengeAUserService,
  acceptChallengeService,
  rejectChallengeService,
} from "../services/challengesService";
import { getUserFromId } from "../services/userService";

interface ChallengeRequestBody {
  challengedBy: string;
  challengedTo: string;
  challengeName: string;
  exerciseType: string;
}

const challengeAUser = async (
  req: Request<{}, {}, ChallengeRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    challengedBy,
    challengedTo,
    challengeName,

    exerciseType,
  } = req.body;

  try {
    const [challengedByUserExists, challengedToUserExists] = await Promise.all([
      getUserFromId(challengedBy),
      getUserFromId(challengedTo),
    ]);

    if (!challengedByUserExists || !challengedToUserExists) {
      res.status(400).json({ message: "One or both users not found." });
    }

    const challenge = await challengeAUserService({
      challengedBy,
      challengedTo,
      challengeName,
      exerciseType,
    });

    res.status(200).json({ message: "Challenge sent", challenge });
  } catch (error) {
    next(error);
  }
};

const acceptChallenge = async (
  req: Request<{}, {}, { challengeId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { challengeId } = req.body;

  try {
    const challenge = await acceptChallengeService(challengeId);

    res.status(200).json({ message: "Challenge accepted", challenge });
  } catch (error) {
    next(error);
  }
};

const rejectChallenge = async (
  req: Request<{}, {}, { challengeId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { challengeId } = req.body;

  try {
    const challenge = await rejectChallengeService(challengeId);

    if (!challenge) {
      res.status(400).json({ message: "Challenge not found." });
    }

    challenge.challangeStatus = "declined";

    await challenge.save();

    res.status(200).json({ message: "Challenge declined", challenge });
  } catch (error) {
    next(error);
  }
};

export default { challengeAUser, acceptChallenge, rejectChallenge };
