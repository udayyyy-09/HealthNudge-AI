const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendVerificationEmail = require("../utils/sendEmail");

//singUp
const register = async (req, res) => {
  try {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const { name, email, password, age , goal, diet} = req.body;

    //get user by email
    const userExist = await User.findOne({ email });
    if (userExist) {
      console.log("User already exists", userExist.email);
      return res
        .status(400)
        .json({ message: "User already exists", email: userExist.email });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user and save to database
    const user = new User({
      name,
      email,
      password: hashedPassword,
      age,
      verificationToken,
      goal,
      dietType: diet,
    });
    await user.save();

    //Before generating token, send verification email
    await sendVerificationEmail(user.email, verificationToken);        //function to send verification email

    //Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    //send token in response
    res.status(201).json({
      message: "User registered successfull. Please verify your email to login",
    });
  } catch (err) {
    console.log("Error in user registration", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    //If user found verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log("Invalid password");
      return res.status(400).json({ message: "Invalid password" });
    }

    //check if user is verified before login
    if (!user.isVerified) {
      console.log("User not verified");
      return res
        .status(403)
        .json({ message: "Please verify your email to login" });
    }

    //Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Send token in HTTP-only cookie for better security
    // In production, set SameSite=None to allow cross-site cookies from the frontend domain
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successfuull",
        user: {
        userId: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
        },
      });
  } catch (err) {
    console.log("Error in user login", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Find user by verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      console.log("User not found, invalid token");
      return res.status(404).json({ message: "User not found" });
    }

    //edge case: if user is already verified
    if (user.isVerified) {
      console.log("User already verified");
      return res.status(400).json({ message: "User already verified" });
    }

    // If verified then update user and remove verification token
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    console.log("Email verified successfully");
    
    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.log("Error in email verification", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  register,
  verifyEmail,
  login
};
