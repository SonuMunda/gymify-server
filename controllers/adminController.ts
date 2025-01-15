import { OneVOneChallenge } from "../models";
import { errorResponse, successResponse } from "../utils/ResponseHelpers";

const getSubmittedChallengesByVerificationStatus = async (
  req: any,
  res: any
) => {
  const { verificationStatus } = req.body;

  try {
    if (
      !verificationStatus ||
      !["pending", "verified", "rejected"].includes(
        verificationStatus as string
      )
    ) {
      const errMessage =
        "Invalid or missing verificationStatus. Valid values are 'pending', 'verified', or 'rejected'.";
      errorResponse(res, errMessage, 400);
      return;
    }

    const challenges = await OneVOneChallenge.find({
      verificationStatus,
      proofVideoUrl: { $exists: true, $ne: null },
    })
      .sort({ createdAt: -1 })
      .populate("challengedBy challengedTo", "-password")
      .lean();

    if (!challenges.length) {
      const errMessage = "No challenges found";
      errorResponse(res, errMessage, 404);
      return;
    }
    successResponse(res, "Challenges fetched successfully", challenges, 200);
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

const updateSubmittedChallengeVerificationStatus = async (
  req: any,
  res: any
) => {
  const { challengeId, verificationStatus, reasonForRejectionFromAdmin } =
    req.body;

  try {
    if (
      !challengeId ||
      !verificationStatus ||
      !["verified", "rejected"].includes(verificationStatus as string)
    ) {
      const errMessage =
        "Invalid or missing challengeId or verificationStatus. Valid values for verificationStatus are 'verified' or 'rejected'.";
      errorResponse(res, errMessage, 400);
      return;
    }

    const challenge = await OneVOneChallenge.findById(challengeId);
    if (!challenge) {
      const errMessage = "Challenge not found";
      errorResponse(res, errMessage, 404);
      return;
    }
    challenge.verificationStatus = verificationStatus
      ? verificationStatus
      : challenge.verificationStatus;
    challenge.reasonForRejectionFromAdmin = reasonForRejectionFromAdmin
      ? reasonForRejectionFromAdmin || "No reason provided"
      : challenge.reasonForRejectionFromAdmin;
    challenge.verifiedAt =
      verificationStatus === "verified" ? new Date() : undefined;
    await challenge.save();

    // TODO : we have to do calculation for rewarding points and winner

    successResponse(
      res,
      `${challenge.challengeName.toUpperCase()} Challenge status updated to ${verificationStatus}`,
      challenge,
      200
    );
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

export {
  getSubmittedChallengesByVerificationStatus,
  updateSubmittedChallengeVerificationStatus,
};
