import dotenv from 'dotenv';
dotenv.config();

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
import shareRoutes from "./modules/polling/share/routes/shareRoutes.js";
import timerRoutes from "./modules/polling/timer/routes/timerRoutes.js";

import sessionMiddleware from "./common/middleware/sessionMiddleware.js";
import errorMiddleware from "./common/middleware/errorMiddleware.js";

const app = express();

const allowedOrigins = [
"http://localhost:5173",
"https://pollsync-vert.vercel.app",
"https://pollsync.soumyaditya.in",
];

const isVercelPreview =
(origin) => {


return (
  typeof origin === "string" &&
  origin.includes(
    "zemongsts-projects.vercel.app"
  )
);


};

app.use(
cors({

origin: (
  origin,
  callback
) => {

  if (
    !origin ||
    allowedOrigins.includes(origin) ||
    isVercelPreview(origin)
  ) {

    callback(null, true);

  } else {

    callback(
      new Error(
        "Not allowed by CORS"
      )
    );
  }
},

credentials: true,

})
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(sessionMiddleware);

app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/polls", voteRoutes);
app.use("/api/polls", pollResultRoutes);
app.use("/api/polls", pollAnalyticsRoutes);
app.use("/api/polls", pollLeaderboardRoutes);
app.use("/api/share", shareRoutes);
app.use("/api/polls", timerRoutes);

app.get("/", (req, res) => {
res.send("Server is running");
});

app.get("/health", (req, res) => {
  console.log("Health check ping");
  res.status(200).json({ status: "ok" });
});

app.use(errorMiddleware);

export default app;
