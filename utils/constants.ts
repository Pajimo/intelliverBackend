const crypto = require("crypto");

export const saltRounds = 10;

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
