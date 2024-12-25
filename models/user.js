const { Schema } = require("mongoose");

const userSchema = new Schema({
  avatar: {
    type: String,
    default: "",
  },
  fullName: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  winnings: {
    type: Number,
    default: 0,
  },
  totalSore: {
    type: Number,
    default: 0,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = userSchema;
