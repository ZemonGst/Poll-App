import express from "express";

import {
  getPollResults,
} from "../controllers/pollResultController.js";

const router = express.Router();


//RESULT VISIBILITY API
router.get(

  "/:id/results",

  getPollResults
);

export default router;