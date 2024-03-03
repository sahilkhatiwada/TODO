import { User } from "./user.model.js";
import {
  emailValidationSchema,
  registerUserValidationSchema,
} from "./user.validation.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// validates user data before registration
export const validateNewUser = async (req, res, next) => {
  // extract new user data from req.body
  const newUser = req.body;

  // validate new user
  try {
    await registerUserValidationSchema.validate(newUser);
  } catch (error) {
    // if validation fails, throw error
    return res.status(400).send({ message: error.message });
  }

  next();
};

// adds user
export const registerUser = async (req, res) => {
  // extract new user data from req.body
  const newUser = req.body;

  // check if user with this email exists
  const user = await User.findOne({ email: newUser.email });

  // if user exists, throw error
  if (user) {
    return res
      .status(409)
      .send({ message: "User with this email already exists." });
  }

  // hash password using bcrypt
  const hashedPassword = await bcrypt.hash(newUser.password, 10);

  newUser.password = hashedPassword;

  // create user
  await User.create(newUser);

  return res.status(201).send({ message: "User is registered successfully." });
};

// validate email
export const validateUserEmail = async (req, res, next) => {
  // extract login credentials from req.body
  const loginCredentials = req.body;

  // validate email
  try {
    await emailValidationSchema.validate(loginCredentials.email);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }

  next();
};

// login user and send token
export const loginUser = async (req, res) => {
  // extract login credentials from req.body
  const loginCredentials = req.body;

  // check if email matches
  const user = await User.findOne({ email: loginCredentials.email });

  // if not user, throw error
  if (!user) {
    return res.status(404).send({ message: "Invalid credentials." });
  }

  // check for password matches or not
  const passwordMatch = await bcrypt.compare(
    loginCredentials.password,
    user.password
  );

  if (!passwordMatch) {
    return res.status(404).send({ message: "Invalid credentials." });
  }

  user.password = undefined;

  // generate token using encryption algorithm
  const token = jwt.sign(
    { email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    }
  );

  return res.status(200).send({ user, accessToken: token });
};
