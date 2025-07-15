const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: 10,
      max: 90,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    goal:{
      type: String,
      enum: ["weight loss", "muscle gain", "general wellness"],
      default: "general wellness",
    },
    diet:{
      type: String,
      enum: ["vegetarian", "non-vegetarian"],
      default: "vegetarian",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
