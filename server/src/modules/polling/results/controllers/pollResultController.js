import asyncHandler from "../../../../common/utils/asyncHandler.js";

import {
  getPollResultsService,
} from "../services/pollResultService.js";

export const getPollResults =
  asyncHandler(

    async (
      req,
      res
    ) => {

      const results =

        await getPollResultsService(

          req.params.id,

          req.user?._id || null
        );

      return res
        .status(200)
        .json({

          success: true,

          statusCode: 200,

          message:
            "Poll results fetched successfully",

          data: results,
        });
    }
  );
