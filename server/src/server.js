import "dotenv/config";

import http from "http";

import app from "./app.js";

import connectDB
  from "./common/config/db.js";

import {
  startPollExpirationJob,
} from "./modules/polling/timer/jobs/pollExpiration.job.js";

import {
  initializeSocketServer,
} from "./modules/realtime/socket/socketServer.js";

connectDB();

const PORT =
  process.env.PORT || 8000;

const httpServer =
  http.createServer(app);

initializeSocketServer(
  httpServer
);

httpServer.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

  startPollExpirationJob();
});