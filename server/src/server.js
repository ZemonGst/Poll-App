import "dotenv/config";
import app from "./app.js";
import connectDB from "./common/config/db.js";
import { startPollExpirationJob } from "./modules/polling/timer/jobs/pollExpiration.job.js";


connectDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startPollExpirationJob();
});