const nodemailer = require("nodemailer");
const logger = require("./logger");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (to, otp, purpose = "register") => {
  let subject;
  let text;
  if (purpose === "register") {
    subject = "Verify your FarmConnect account";
    text = `Your OTP for registration is: ${otp}\nIt will expire in ${
      process.env.OTP_EXPIRES_IN || 10
    } minutes.\n- FarmConnect Team`;
  } else if (purpose === "login") {
    subject = "Login OTP - FarmConnect";
    text = `Your OTP for login is: ${otp}\nIt will expire in ${
      process.env.OTP_EXPIRES_IN || 5
    } minutes.\n- FarmConnect Team`;
  } else if (purpose === "reset") {
    subject = "Password reset OTP - FarmConnect";
    text = `Your OTP to reset your FarmConnect password is: ${otp}\nIt will expire in ${
      process.env.OTP_EXPIRES_IN || 5
    } minutes.\nIf you did not request this, ignore this email.\n- FarmConnect Team`;
  } else {
    subject = "FarmConnect OTP";
    text = `Your OTP: ${otp}\nIt will expire in ${
      process.env.OTP_EXPIRES_IN || 10
    } minutes.\n- FarmConnect Team`;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
    });
    logger.info("Sent %s email to %s", purpose, to);
  } catch (err) {
    logger.error("Failed to send email to %s: %o", to, err);
    throw err;
  }
};

module.exports = { sendOTPEmail };
