import express from "express";

import {
  getPollByShareCodeController,
} from "../controllers/shareController.js";

const router =
  express.Router();

//  Get poll by share code
router.get(
  "/:shareCode",
  getPollByShareCodeController
);

export default router;