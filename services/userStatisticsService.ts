import { UserStatistics } from "../models/index";

interface UserStatisticsRequest {
  userId: string;
  request: {
    height?: number;
    weight?: number;
    age?: number;
  };
}

interface UserExerciseLogRequest {
  userId: string;
  request: {
    exerciseName: string;
    weight: number;
    date: Date;
    proof?: string;
  };
}

const getUserStatisticsService = async (userId: String) => {
  try {
    const userStatistics = await UserStatistics.findOne({ user: userId });

    if (!userStatistics) {
      throw new Error("User statistics not found");
    }

    return userStatistics;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch user statistics");
  }
};
const updateUserStatisticsService = async ({
  userId,
  request,
}: UserStatisticsRequest) => {
  try {
    let userStatistics = await UserStatistics.findOne({ user: userId });

    if (!userStatistics) {
      userStatistics = new UserStatistics({ user: userId });
    }

    if (request.height !== undefined) {
      userStatistics.height = request.height;
    }

    if (request.weight !== undefined) {
      userStatistics.weight = request.weight;
    }

    if (request.age !== undefined) {
      userStatistics.age = request.age;
    }

    await userStatistics.save();

    return userStatistics;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update user statistics");
  }
};

const updateUserExerciseLogService = async ({
  userId,
  request,
}: UserExerciseLogRequest) => {
  try {
    let userStatistics = await UserStatistics.findOne({ user: userId });

    if (!userStatistics) {
      userStatistics = new UserStatistics({ user: userId, stats: [] });
    }

    const { exerciseName } = request;

    const exerciseIndex = userStatistics.stats.findIndex(
      (exercise) => exercise.exerciseName === exerciseName
    );

    const { weight, proof } = request;

    let log = { weight, proof, date: new Date() };

    if (exerciseIndex > -1) {
      userStatistics.stats[exerciseIndex].logs.push(log);
    } else {
      userStatistics.stats.push({
        exerciseName,
        logs: [log],
      });
    }

    await userStatistics.save();

    return userStatistics;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update user statistics");
  }
};

export {
  updateUserStatisticsService,
  getUserStatisticsService,
  updateUserExerciseLogService,
};
