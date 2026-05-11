import asyncHandler
from "../utils/asyncHandler.js";

import ApiResponse
from "../responses/ApiResponse.js";

import {
  createPollService,
} from "../services/pollService.js";






export const createPoll =
  asyncHandler(

    async (req, res) => {

      const poll =
        await createPollService({

          ...req.body,

          createdBy:
            req.user._id,
        });





      return res.status(201).json(

        new ApiResponse(

          201,

          "Poll created successfully",

          poll
        )
      );
    }
  );