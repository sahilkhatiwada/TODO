import crypto from "crypto";

const generateRandomString = () => {
  return crypto.randomBytes(64).toString("hex");
};

const token = generateRandomString();

console.log(token);
