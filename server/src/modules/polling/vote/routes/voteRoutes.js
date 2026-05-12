import express from "express";

import {
  votePoll,
} from "../controllers/voteController.js";

import validate from "../../../../common/middleware/validateMiddleware.js";

import optionalAuth from "../../../../common/middleware/optionalAuthMiddleware.js";

import {
  votePollSchema,
} from "../validators/vote.validator.js";

const router = express.Router();

// Vote Poll (supports both authenticated and anonymous voting)
router.post(
  "/:id/vote",
  optionalAuth,
  validate(votePollSchema),
  votePoll
);

export default router;

