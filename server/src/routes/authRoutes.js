import express from "express";

import { registerLocalUser, loginLocalUser } from "../controllers/authController.js";

const router = express.Router();



router.post("/register", registerLocalUser);
router.post("/login", loginLocalUser);



export default router;