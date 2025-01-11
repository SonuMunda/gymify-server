import { OneVOneChallenge, UserModel } from "../models/index.js";

interface ChallengeRequest {
  challengedBy: string;
  challengedTo: string;
  challengeName: string;
  exerciseType: string;
}

interface UserModel {
  _id: string;
  challengesSent: string[];
  challengesReceived: string[];
}

const challengeAUserService = async ({
  challengedBy,
  challengedTo,
  challengeName,
  exerciseType,
}: ChallengeRequest) => {
  try {
    const challenge = new OneVOneChallenge({
      challengeName,
      exerciseType,
      challengedBy,
      challengedTo,
    });

    const [challengedByUser, challengedToUser] = await Promise.all([
      UserModel.findById(challengedBy),
      UserModel.findById(challengedTo),
    ]);

    if (!challengedByUser || !challengedToUser) {
      throw new Error("One or both users not found.");
    }

    challengedByUser.challengesSent = challengedByUser.challengesSent || [];
    challengedToUser.challengesReceived =
      challengedToUser.challengesReceived || [];

    challengedByUser.challengesSent.push(challenge._id);
    challengedToUser.challengesReceived.push(challenge._id);

    await Promise.all([
      challengedByUser.save(),
      challengedToUser.save(),
      challenge.save(),
    ]);

    return challenge;
  } catch (error: any) {
    throw new Error(`Error creating challenge: ${error.message}`);
  }
};

const acceptChallengeService = async (challengeId: string) => {
  try {
    const challenge = await OneVOneChallenge.findById(challengeId);

    if (!challenge) {
      throw new Error("Challenge not found.");
    }

    challenge.challangeStatus = "accepted";

    await challenge.save();

    return challenge;
  } catch (error: any) {
    throw new Error(`Error accepting challenge: ${error.message}`);
  }
};

const rejectChallengeService = async (challengeId: string) => {
  try {
    const challenge = await OneVOneChallenge.findById(challengeId);

    if (!challenge) {
      throw new Error("Challenge not found.");
    }

    challenge.challangeStatus = "declined";

    await challenge.save();

    return challenge;
  } catch (error: any) {
    throw new Error(`Error declining challenge: ${error.message}`);
  }
};

export {
  challengeAUserService,
  acceptChallengeService,
  rejectChallengeService,
};
