import asyncHandler
from "../utils/asyncHandler.js";

import ApiResponse
from "../responses/ApiResponse.js";

import {
  createPollService,
  getPollByIdService,
  getMyPollsService,
} from "../services/pollService.js";






export const createPoll =  asyncHandler(

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

  
export const getPollById =   asyncHandler(

    async (req, res) => {

      const poll =
        await getPollByIdService(
          req.params.id
        );





      return res.status(200).json(

        new ApiResponse(

          200,

          "Poll fetched successfully",

          poll
        )
      );
    }
  );  

export const getMyPolls =   asyncHandler(

    async (req, res) => {

      const polls =
        await getMyPollsService(
          req.user._id
        );





      return res.status(200).json(

        new ApiResponse(

          200,

          "My polls fetched successfully",

          polls
        )
      );
    }
  );  


