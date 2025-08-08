// utils/otpGenerator.js
const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(
    Date.now() + parseInt(process.env.OTP_EXPIRES_IN || 5) * 60000
  ); // expires in 5 mins
  return { code: otp, expiresAt };
};

module.exports = generateOTP;
