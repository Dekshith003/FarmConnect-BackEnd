// controllers/auth.controller.js
module.exports = ({
  authService /* optional other injected services */,
} = {}) => {
  const Farmer = require("../models/Farmer");
  const Customer = require("../models/Customer");
  const generateOTP = require("../utils/otpGenerator");
  const { sendOTPEmail } = require("../utils/emailService");
  const generateToken = require("../utils/generateToken");
  const { hashPassword, comparePasswords } = require("../utils/hashUtils");
  const logger = require("../utils/logger");
  const { FARMER, CUSTOMER } = require("../constants/roles");

  const getUserModel = (role) => {
    if (role === FARMER) return Farmer;
    if (role === CUSTOMER) return Customer;
    throw new Error("Invalid user role");
  };

  // Registration, verification, login flows (updated for new fields)
  const register = async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      city,
      state,
      zip,
      farmName,
      farmSize,
      farmType,
      experience,
      businessName,
      businessType,
      orderVolume,
      role,
    } = req.body;
    const UserModel = getUserModel(role);
    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email exists" });
    const hashed = await hashPassword(password);
    const { code, expiresAt } = generateOTP();
    // Build user object based on role
    let userObj = {
      firstName,
      lastName,
      email,
      password: hashed,
      phone,
      address,
      city,
      state,
      zip,
      otp: { code, expiresAt },
      isVerified: false,
    };
    if (role === FARMER) {
      userObj = {
        ...userObj,
        farmName,
        farmSize,
        farmType,
        experience,
      };
    } else if (role === CUSTOMER) {
      userObj = {
        ...userObj,
        businessName,
        businessType,
        orderVolume,
      };
    }
    const user = await UserModel.create(userObj);
    await sendOTPEmail(email, code, "register");
    return res.status(201).json({ message: "OTP sent for verification", role });
  };

  const verifyRegistration = async (req, res) => {
    const { email, otp, role } = req.body;
    const UserModel = getUserModel(role);
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (
      !user.otp ||
      user.otp.code !== otp ||
      new Date(user.otp.expiresAt) < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    user.isVerified = true;
    user.otp = undefined;
    await user.save();
    const token = generateToken({ id: user._id, role });
    return res.status(200).json({ message: "Verified", token });
  };

  const login = async (req, res) => {
    const { email, password, role } = req.body;
    const UserModel = getUserModel(role);
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const match = await comparePasswords(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    if (!user.isVerified)
      return res.status(403).json({ message: "User not verified" });
    const token = generateToken({ id: user._id, role });
    return res.status(200).json({ message: "Login successful", token });
  };

  // === NEW: Forgot Password ===
  const forgotPassword = async (req, res) => {
    const { email, role } = req.body;
    if (!email || !role)
      return res.status(400).json({ message: "Email and role are required" });

    // get user by role
    const user =
      role === "farmer"
        ? await Farmer.findOne({ email })
        : await Customer.findOne({ email });
    if (!user) {
      // avoid revealing existence of account — respond success for security, but log
      logger.warn(
        "Password reset requested for non-existing user: %s (%s)",
        email,
        role
      );
      return res.status(200).json({
        message: "If an account with this email exists, an OTP has been sent",
      });
    }

    // generate OTP and save
    const { code, expiresAt } = generateOTP();
    user.otp = { code, expiresAt };
    await user.save();

    // send OTP email
    await sendOTPEmail(email, code, "reset"); // purpose 'reset' handled in emailService text
    logger.info("Password reset OTP sent for %s (%s)", email, role);

    return res.status(200).json({
      message: "If an account with this email exists, an OTP has been sent",
    });
  };

  // === NEW: Reset Password with OTP ===
  const resetPassword = async (req, res) => {
    const { email, otp, role, newPassword } = req.body;
    if (!email || !otp || !role || !newPassword)
      return res.status(400).json({ message: "Missing required fields" });

    const UserModel = getUserModel(role);
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      !user.otp ||
      user.otp.code !== otp ||
      new Date(user.otp.expiresAt) < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashed = await hashPassword(newPassword);
    user.password = hashed;
    user.otp = undefined;
    await user.save();
    logger.info("Password reset successful for %s (%s)", email, role);

    return res
      .status(200)
      .json({ message: "Password has been reset successfully" });
  };

  // === NEW: Change Password (authenticated) ===
  const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res
        .status(400)
        .json({ message: "Old and new passwords are required" });

    const role = req.user.role;
    const id = req.user.id;
    const UserModel = getUserModel(role);
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await comparePasswords(oldPassword, user.password);
    if (!match)
      return res.status(400).json({ message: "Old password is incorrect" });

    user.password = await hashPassword(newPassword);
    await user.save();
    logger.info("Password changed for user %s (%s)", user.email, role);

    return res.status(200).json({ message: "Password changed successfully" });
  };

  // return controller methods
  return {
    register,
    verifyRegistration,
    login,
    forgotPassword,
    resetPassword,
    changePassword,
  };
};
