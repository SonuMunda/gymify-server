import { Schema } from "mongoose";
import { ILog, logSchema } from "./LogModel";

export interface IExercise {
  exerciseName: string;
  logs: ILog[];
}

export const exerciseSchema = new Schema<IExercise>({
  exerciseName: {
    type: String,
    enum: ["bench press", "squat", "deadlift",],
    required: true,
  },
  logs: [logSchema],
});
