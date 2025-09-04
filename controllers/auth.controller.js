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

  const notificationService = require("../services/notification.service")();
  const register = async (req, res) => {
    try {
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
        role,
        otp: { code, expiresAt },
        isVerified: false,
      };
      if (role === FARMER) {
        console.log(userObj, "-----------------------------------");
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
      console.log(userObj, "**********");
      const user = await UserModel.create(userObj);
      await sendOTPEmail(email, code, "register");
      // Send notification for registration
      await notificationService.createNotification(
        user._id,
        role.charAt(0).toUpperCase() + role.slice(1),
        "success",
        "Registration successful! Please verify your email to activate your account.",
        { email }
      );
      return res.status(201).json({
        message: "OTP sent for verification",
        role,
        email: req.body.email,
      });
    } catch (err) {
      // Duplicate email error from MongoDB
      if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      // Validation error
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: err.message, errors: err.errors });
      }
      // Other errors
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  };

  const verifyRegistration = async (req, res) => {
    const { email, otp, role } = req.body;
    const UserModel = getUserModel(role);
    logger.info(
      `[OTP VERIFY] Attempt for email: ${email}, role: ${role}, otp: ${otp}`
    );
    const user = await UserModel.findOne({ email });
    if (!user) {
      logger.warn(
        `[OTP VERIFY] User not found for email: ${email}, role: ${role}`
      );
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.otp) {
      logger.warn(
        `[OTP VERIFY] No OTP found for user: ${email}, role: ${role}`
      );
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    if (user.otp.code !== otp) {
      logger.warn(
        `[OTP VERIFY] OTP mismatch for user: ${email}, expected: ${user.otp.code}, got: ${otp}`
      );
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    if (new Date(user.otp.expiresAt) < new Date()) {
      logger.warn(
        `[OTP VERIFY] OTP expired for user: ${email}, expiredAt: ${user.otp.expiresAt}`
      );
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    user.isVerified = true;
    user.otp = undefined;
    await user.save();
    logger.info(`[OTP VERIFY] Success for user: ${email}, role: ${role}`);
    const token = generateToken({ id: user._id, role });
    // Send notification for OTP verification
    await notificationService.createNotification(
      user._id,
      role.charAt(0).toUpperCase() + role.slice(1),
      "success",
      "Your account has been verified successfully!",
      { email: user.email }
    );
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

    // console.log(user);
    const userDetails = {
      id: user._id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
    };
    // Send notification for login
    const notifRole =
      typeof user.role === "string" && user.role.length > 0
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "Farmer";
    await notificationService.createNotification(
      user._id,
      notifRole,
      "info",
      "Login successful! Welcome back.",
      { email: user.email }
    );
    return res
      .status(200)
      .json({ message: "Login successful", userDetails, token });
  };

  // === NEW: Forgot Password ===
  const forgotPassword = async (req, res) => {
    try {
      const { email, role } = req.body;
      const UserModel = getUserModel(role);

      const user = await UserModel.findOne({ email });

      // Always respond success (don't leak whether email exists)
      if (!user) {
        return res.status(200).json({
          message: "If an account with this email exists, an OTP has been sent",
        });
      }

      // Generate OTP for reset
      const { code, expiresAt } = generateOTP();
      user.otp = { code, expiresAt };
      await user.save();

      // Send OTP email
      await sendOTPEmail(email, code, "reset");

      logger.info("Password reset OTP sent for %s (%s)", email, role);

      // Notification (optional)
      await notificationService.createNotification(
        user._id,
        role.charAt(0).toUpperCase() + role.slice(1),
        "info",
        "Password reset OTP sent.",
        { email: user.email }
      );

      return res.status(200).json({
        message: "If an account with this email exists, an OTP has been sent",
      });
    } catch (err) {
      logger.error("Forgot password error: %s", err.message);
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
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
module.exports = module.exports;
