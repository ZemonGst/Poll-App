import express from "express";

import {
  registerLocalUser,
  loginLocalUser,
  getMe,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

import validate from "../middleware/validateMiddleware.js";

import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";

const router = express.Router();





router.post(
  "/register",

  validate(registerSchema),

  registerLocalUser
);





router.post(
  "/login",

  validate(loginSchema),

  loginLocalUser
);





router.get(
  "/me",

  protect,

  getMe
);





export default router;