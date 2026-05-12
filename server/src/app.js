import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";

import "./common/config/passport.js";

import authRoutes from "./modules/auth/routes/authRoutes.js";
import pollRoutes from "./modules/polling/poll/routes/pollRoutes.js";
import voteRoutes from "./modules/polling/vote/routes/voteRoutes.js";
import pollResultRoutes from "./modules/polling/results/routes/pollResultRoutes.js";
import pollAnalyticsRoutes from "./modules/polling/analytics/routes/pollAnalyticsRoutes.js";
import pollLeaderboardRoutes from "./modules/polling/leaderboard/routes/pollLeaderboardRoutes.js";

import sessionMiddleware from "./common/middleware/sessionMiddleware.js";
import errorMiddleware from "./common/middleware/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/polls", voteRoutes);
app.use("/api/polls", pollResultRoutes);
app.use("/api/polls", pollAnalyticsRoutes);
app.use("/api/polls", pollLeaderboardRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use(errorMiddleware);

export default app;