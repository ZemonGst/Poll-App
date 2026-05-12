import express from "express";

import {
  getPollResults,
} from "../controllers/pollResultController.js";

import optionalAuth from "../../../../common/middleware/optionalAuthMiddleware.js";

const router = express.Router();


//RESULT VISIBILITY API (supports both public access and owner override)
router.get(

  "/:id/results",

  optionalAuth,

  getPollResults
);

export default router;

