import {
  getUserStatisticsService,
  updateUserExerciseLogService,
  updateUserStatisticsService,
} from "../services/userStatisticsService";
import { errorResponse, successResponse } from "../utils/ResponseHelpers";

const getUserStatistics = async (req: any, res: any) => {
  const userId = req.authData.userId;
  if (!userId) {
    errorResponse(res, "Unauthorized", 401);
    return;
  }

  try {
    const result = await getUserStatisticsService(userId);
    successResponse(res, "User statistics fetched successfully", result);
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

const updateUserStatistics = async (req: any, res: any) => {
  const userId = req.authData.userId;
  if (!userId) {
    errorResponse(res, "Unauthorized", 401);
    return;
  }

  try {
    const result = await updateUserStatisticsService({
      userId,
      request: req.body,
    });

    successResponse(res, "User statistics updated successfully", result);
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

const updateUserExcerciseLog = async (req: any, res: any) => {
  const userId = req.authData.userId;
  if (!userId) {
    errorResponse(res, "Unauthorized", 401);
    return;
  }

  try {
    const result = await updateUserExerciseLogService({
      userId,
      request: req.body,
    });

    successResponse(res, "User statistics updated successfully", result);
    return;
  } catch (error: any) {
    errorResponse(res, error.message, 500, error);
    return;
  }
};

export { updateUserStatistics, getUserStatistics, updateUserExcerciseLog };
