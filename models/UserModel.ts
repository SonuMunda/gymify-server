import mongoose, { Document } from "mongoose";

export interface IUser {
  id?: string;
  avatar?: string;
  fullName?: string;
  username?: string;
  email: string;
  gender?: string;
  verified?: boolean;
  about?: string;
  password?: string;
  source?: string;
  winningStreak?: number;
  totalScore?: number;
  role?: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    avatar: { type: String },
    fullName: { type: String },
    username: { type: String, unique: true },
    about: { type: String },
    email: { type: String, required: true, unique: true },
    gender: { type: String, enum: ["male", "female"] },
    verified: { type: Boolean, default: false },
    password: { type: String },
    source: { type: String },
    winningStreak: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    role: { type: String, default: "user" },
  },
  { collection: "users", timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
