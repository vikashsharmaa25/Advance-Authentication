const bcrypt = require("bcrypt");
const model = require("../models");
const { generateUUID } = require("../utils/generateUUID");
const sendOtpToEmail = require("../service/emailProvider");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  try {
    const id = generateUUID();
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await model.User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const verificationOTP = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Create new user
    const newUser = await model.User.create({
      id,
      name,
      email,
      password: hashedPassword,
      verificationOTP,
      otpExpiresAt: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
    });

    // Send OTP email
    // Send OTP email with both the email and OTP
    await sendOtpToEmail(newUser.email, verificationOTP);

    // Generate token
    const token = generateToken(newUser);
    res.cookie("token", token, { maxAge: 36000000 });

    return res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isVerified: false,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { verificationOTP } = req.body;

    // Find user by OTP
    const user = await model.User.findOne({
      where: { verificationOTP },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check if OTP has expired
    if (user.otpExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Mark user as verified
    user.verificationOTP = null;
    user.otpExpiresAt = null;
    user.isVerified = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    // Find user by email
    const user = await model.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        error: "User is already verified. Please log in.",
      });
    }

    // Generate new OTP
    const verificationOTP = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.verificationOTP = verificationOTP;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    await user.save();

    // Resend OTP email
    await sendOtpToEmail(user.email, verificationOTP);

    return res.status(200).json({
      message: "A new OTP has been sent to your email.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    // Find user by email
    const user = await model.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    // Generate new OTP
    const resetOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiration time for password reset
    user.verificationOTP = resetOTP;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    await user.save();

    // Send OTP email for password reset
    await sendOtpToEmail(user.email, resetOTP);

    return res.status(200).json({
      message: "Password reset OTP has been sent to your email.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, verificationOTP, newPassword } = req.body;

    // Check if all required fields are provided
    if (!email || !verificationOTP || !newPassword) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Find user by email and OTP
    const user = await model.User.findOne({
      where: { email, verificationOTP },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid OTP or email." });
    }

    // Check if OTP has expired
    if (user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ error: "OTP has expired." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear OTP
    user.password = hashedPassword;
    user.verificationOTP = null;
    user.otpExpiresAt = null;

    await user.save();

    return res.status(200).json({
      message:
        "Password reset successful! You can now log in with the new password.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // Find user by email
    const user = await model.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ error: "Please verify your email to log in." });
    }

    // Compare the password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Generate token and send it as a cookie
    const token = generateToken(user);
    res.cookie("token", token, { maxAge: 36000000, httpOnly: true });

    return res.status(200).json({
      message: "Login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.logoutUser = (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true });

    return res.status(200).json({
      message: "Logout successful!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "user id not found",
      });
    }

    const user = await model.User.findOne({
      where: { id: id },
      attributes: ["id", "email", "name"],
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user profile get successfully",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
