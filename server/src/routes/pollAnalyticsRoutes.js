import express from "express";

import { getPollAnalytics } from "../controllers/pollAnalyticsController.js";



import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

//GET POLL ANALYTICS API
router.get(

  "/:id/analytics",

  protect,

  getPollAnalytics
);

export default router;