import { getPollTimerService } from "../services/timerService.js";
import ApiResponse from "../../../../common/responses/ApiResponse.js";
import asyncHandler from "../../../../common/utils/asyncHandler.js";

export const getPollTimerController = asyncHandler(async (req, res) => {
  const { pollId } = req.params;

  const timerData = await getPollTimerService(pollId);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Poll timer fetched successfully",
      timerData
    )
  );
});
