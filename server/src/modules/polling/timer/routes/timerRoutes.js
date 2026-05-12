import { Router } from "express";
import { getPollTimerController } from "../controllers/timerController.js";

const router = Router();

router.get("/:pollId/timer", getPollTimerController);

export default router;
