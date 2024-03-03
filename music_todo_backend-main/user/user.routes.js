import { Router } from "express";
import {
  loginUser,
  registerUser,
  validateNewUser,
  validateUserEmail,
} from "./user.service.js";

const router = Router();

router.post("/user/register", validateNewUser, registerUser);

router.post("/user/login", validateUserEmail, loginUser);

export default router;
