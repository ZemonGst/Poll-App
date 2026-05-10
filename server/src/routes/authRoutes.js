import express from "express";
import passport from "passport";

import {
  registerLocalUser,
  loginLocalUser,
  getMe,
  googleAuthSuccess,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";

import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";

const router = express.Router();


// Local Register Route
router.post(
  "/register",
  validate(registerSchema),
  registerLocalUser
);


// Local Login Route
router.post(
  "/login",
  validate(loginSchema),
  loginLocalUser
);


// Current Authenticated User Route
router.get(
  "/me",
  protect,
  getMe
);


// Google OAuth Login Route
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);


// Google OAuth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleAuthSuccess
);

export default router;