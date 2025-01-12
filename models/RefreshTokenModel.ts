import mongoose, { Document, Schema } from "mongoose";

export interface IRefreshToken {
  userRef: string;
  loginTime: Date;
  token: string;
}

const refreshTokenSchema: Schema = new mongoose.Schema({
  userRef: {
    type: String,
    ref: "User",
    required: true,
    index: true,
  },
  loginTime: {
    type: Date,
    required: true,
  },
  token: {
    type: String,
    required: true,
    index: true,
  },
});

const RefreshToken = mongoose.model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema
);

export default RefreshToken;
