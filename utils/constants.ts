import crypto = require("crypto");
import jwt = require("jsonwebtoken");

export const Environment: any = "dev";

export const saltRounds = 10;

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const generateToken = (userId: string) => {
  const secretKey = process.env.JWT_SECRET_KEY; // Store your secret key in an environment variable
  const token = jwt.sign({ userId }, secretKey, { expiresIn: "1h" });
  return token;
};

export const ApiUrl =
  process.env.NODE_ENV === "dev"
    ? "https://intelliverback.azurewebsites.net/api/"
    : "http://localhost:7071/api/";

export const redirectUrl =
  process.env.NODE_ENV === "prod"
    ? "https://intelliver.app/auth/user/login"
    : "http://localhost:3000/auth/user/login";
