import express from "express";

import {
  getPollLeaderboard,
} from "../controllers/pollLeaderboardController.js";

const router =
  express.Router();


//GET POLL LEADERBOARD
router.get(

  "/:id/leaderboard",

  getPollLeaderboard
);

export default router;
