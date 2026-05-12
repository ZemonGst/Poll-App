import express from "express";

import {
  createPoll,
  getPollById,
  getMyPolls,
  updatePoll,
  deletePoll,
  endPoll,
} from "../controllers/pollController.js";

import { protect } from "../../../../common/middleware/authMiddleware.js";

import validate from "../../../../common/middleware/validateMiddleware.js";

import {
  createPollSchema,
  updatePollSchema,
} from "../validators/poll.validator.js";

const router = express.Router();


// Create Poll
router.post(
  "/",
  protect,
  validate(createPollSchema),
  createPoll
);

// Get User Polls
router.get(
  "/me",
  protect,
  getMyPolls
);

// Get Poll By ID
router.get(
  "/:id",
  getPollById
);

// Update Poll
router.patch(
  "/:id",
  protect,
  validate(updatePollSchema),
  updatePoll
);

// Delete Poll
router.delete(
  "/:id",
  protect,
  deletePoll
);

// End Poll
router.patch(
  "/:id/end",
  protect,
  endPoll
);

export default router;
