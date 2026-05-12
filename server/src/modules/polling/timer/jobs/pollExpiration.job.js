import Poll from "../../poll/models/Poll.js";

export const startPollExpirationJob = () => {
  console.log("Poll expiration job started...");

  // Check every 10 seconds for expired polls
  setInterval(async () => {
    try {
      const now = new Date();
      
      // Find active polls that have expired
      const expiredPolls = await Poll.find({
        status: "active",
        expiresAt: { $lte: now, $ne: null }
      });

      if (expiredPolls.length > 0) {
        console.log(`Ending ${expiredPolls.length} expired polls...`);
        
        for (const poll of expiredPolls) {
          poll.status = "ended";
          await poll.save();
        }
      }
    } catch (error) {
      console.error("Error in poll expiration job:", error);
    }
  }, 10000); // Check every 10 seconds
};
