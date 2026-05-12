import asyncHandler from "../../../../common/utils/asyncHandler.js";

import {
  getPollLeaderboardService,
} from "../services/pollLeaderboardService.js";

export const getPollLeaderboard =
  asyncHandler(

    async (
      req,
      res
    ) => {

      const leaderboard =

        await getPollLeaderboardService(

          req.params.id
        );

      return res
        .status(200)
        .json({

          success: true,

          statusCode: 200,

          message:
            "Leaderboard fetched successfully",

          data: leaderboard,
        });
    }
  );
