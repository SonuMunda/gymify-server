import { Schema } from "mongoose";

export interface ILog {
  weight: number;
  date: Date;
  proof?: string;
  isVerified?: boolean;
}

export const logSchema = new Schema<ILog>({
  weight: { type: Number, required: true },
  date: { type: Date, required: true },
  proof: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
});
