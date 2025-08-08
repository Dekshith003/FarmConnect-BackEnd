const bcrypt = require("bcryptjs");

const hashOtp = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(otp, salt);
};

const compareOtp = async (otp, hashed) => {
  return await bcrypt.compare(otp, hashed);
};

module.exports = { hashOtp, compareOtp };
