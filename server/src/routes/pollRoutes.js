import express from "express";

import {

  createPoll,
  getPollById,
  getMyPolls,
  updatePoll,
  deletePoll,
  endPoll,
  votePoll,

} from "../controllers/pollController.js";

import { protect }
from "../middleware/authMiddleware.js";

import validate
from "../middleware/validateMiddleware.js";

import {

  createPollSchema,
  votePollSchema,
  updatePollSchema,

} from "../validators/poll.validator.js";

const router =
  express.Router();


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

// Vote Poll
router.post(
  "/:id/vote",
  validate(votePollSchema),
  votePoll
);

export default router;