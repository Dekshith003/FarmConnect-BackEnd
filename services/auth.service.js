// services/auth.service.js
module.exports = ({ farmerRepo, customerRepo } = {}) => {
  const crypto = require("crypto");
  const { hashPassword, comparePasswords } = require("../utils/hashUtils");

  // generate OTP same as otpGenerator but returns string and expiry Date
  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(
      Date.now() + parseInt(process.env.OTP_EXPIRES_IN || 5) * 60000
    );
    return { code: otp, expiresAt };
  };

  const findUserByEmail = async (email, role) => {
    if (role === "farmer") return await farmerRepo.findByEmail(email);
    if (role === "customer") return await customerRepo.findByEmail(email);
    throw new Error("Invalid role");
  };

  const setOtpForUser = async (user, otpObj) => {
    user.otp = otpObj;
    await user.save();
    return user;
  };

  const clearOtpForUser = async (user) => {
    user.otp = undefined;
    await user.save();
    return user;
  };

  const resetPasswordWithOtp = async (user, newPassword) => {
    const hashed = await hashPassword(newPassword);
    user.password = hashed;
    user.otp = undefined;
    await user.save();
    return user;
  };

  const changePassword = async (user, oldPassword, newPassword) => {
    const match = await comparePasswords(oldPassword, user.password);
    if (!match) {
      const err = new Error("Old password is incorrect");
      err.statusCode = 400;
      throw err;
    }
    user.password = await hashPassword(newPassword);
    await user.save();
    return user;
  };

  return {
    generateOtp,
    findUserByEmail,
    setOtpForUser,
    clearOtpForUser,
    resetPasswordWithOtp,
    changePassword,
  };
};
