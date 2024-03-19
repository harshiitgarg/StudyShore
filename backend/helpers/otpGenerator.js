import crypto from "crypto";

const usedOtpSet = new Set();

function generateUniqueOtp() {
  let otp;
  do {
    otp = generateRandomNumber(100000, 999999);
  } while (usedOtpSet.has(otp));
  usedOtpSet.add(otp);
  // console.log(otp);
  return otp;
}

function generateRandomNumber(min, max) {
  return Math.floor(min + crypto.randomInt(max - min + 1));
}

export default generateUniqueOtp;
