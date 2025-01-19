import mongoose, { Document, Schema } from "mongoose";
import { exerciseSchema, IExercise } from "./ExcerciseModel";

export interface IUserStatistics extends Document {
  user: mongoose.Types.ObjectId;
  height: number;
  weight: number;
  age: number;
  stats: IExercise[];
}

const UserStatisticsSchema = new Schema<IUserStatistics>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  age: {
    type: Number,
  },
  stats: [exerciseSchema],
});

const UserStatisticsModel = mongoose.model<IUserStatistics>(
  "UserStatistics",
  UserStatisticsSchema
);

export default UserStatisticsModel;
