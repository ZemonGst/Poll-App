import {
  getPollByShareCodeService,
} from "../services/shareService.js";

import ApiResponse
  from "../../../../common/responses/ApiResponse.js";

import asyncHandler
  from "../../../../common/utils/asyncHandler.js";

export const getPollByShareCodeController =   asyncHandler(async (req, res) => {

    const { shareCode } =
      req.params;

    const poll =
      await getPollByShareCodeService(
        shareCode
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Poll fetched successfully",
        poll
      )
    );
  });
