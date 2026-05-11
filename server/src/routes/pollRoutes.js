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

// Get Single id Poll Route
router.get(
  "/:id",
  getPollById
);

// Update Poll Route
router.patch(

  "/:id",

  protect,

  validate(createPollSchema),

  updatePoll
);

// Delete Poll Route
router.delete(

  "/:id",

  protect,

  deletePoll
);

// End Poll Route
router.patch(

  "/:id/end",

  protect,

  endPoll
);

// Vote Poll Route
router.post(

  "/:id/vote",

  validate(votePollSchema),

  votePoll
);




export default router;