import { OneVOneChallenge, UserModel } from "../models/index.js";

const challengeAUserService = async ({
  challengedBy,
  challengedTo,
  challengeName,
  challengeType,
  exerciseType,
}) => {
  try {
    const challenge = new OneVOneChallenge({
      challengeName,
      challengeType,
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
  } catch (error) {
    throw new Error(`Error creating challenge: ${error.message}`);
  }
};

export default challengeAUserService;
