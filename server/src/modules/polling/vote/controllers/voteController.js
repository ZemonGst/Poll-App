import asyncHandler from "../../../../common/utils/asyncHandler.js";

import {
  votePollService,
} from "../services/voteService.js";

export const votePoll = asyncHandler(
  async (
    req,
    res
  ) => {

    const updatedPoll =
      await votePollService(

        req.params.id,

        req.body.optionId,

        req.user || null,

        req.sessionID || null
      );

    return res.status(200).json({

      success: true,

      statusCode: 200,

      message:
        "Vote submitted successfully",

      data: updatedPoll,
    });
  }
);
