import express from "express";

import {
  createPoll,
  getPollById,
  getMyPolls
} from "../controllers/pollController.js";

import { protect }
from "../middleware/authMiddleware.js";

import validate
from "../middleware/validateMiddleware.js";

import {
  createPollSchema,
} from "../validators/poll.validator.js";





const router =
  express.Router();





// Create Poll Route
router.post(

  "/",

  protect,

  validate(createPollSchema),

  createPoll
);

// Get Current User Polls
router.get(
  "/me",
  protect,
  getMyPolls
);

// Get Single Poll Route
router.get(
  "/:id",
  getPollById
);




export default router;