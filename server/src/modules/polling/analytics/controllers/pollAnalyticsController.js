import asyncHandler from "../../../../common/utils/asyncHandler.js";

import {
  getPollAnalyticsService,
} from "../services/pollAnalyticsService.js";

export const getPollAnalytics =
  asyncHandler(

    async (
      req,
      res
    ) => {

      const analytics =

        await getPollAnalyticsService(

          req.params.id,

          req.user._id
        );

      return res
        .status(200)
        .json({

          success: true,

          statusCode: 200,

          message:
            "Poll analytics fetched successfully",

          data: analytics,
        });
    }
  );
