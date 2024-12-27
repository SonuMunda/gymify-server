import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    avatar: { type: String },
    fullName: { type: String },
    username: { type: String },
    email: { type: String, required: true },
    gender: { type: String },
    verfied: { type: Boolean, default: false },
    about: { type: String },
    password: { type: String },
    source: { type: String },
    winningStreak: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    role: { type: String, default: "user" },
  },
  { collection: "users", timestamps: true }
);

const UserModel = mongoose.model("UserSchema", userSchema);

export default UserModel;
