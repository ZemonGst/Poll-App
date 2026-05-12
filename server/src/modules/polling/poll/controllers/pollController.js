import asyncHandler from "../../../../common/utils/asyncHandler.js";

import ApiResponse from "../../../../common/responses/ApiResponse.js";

import {
  createPollService,
  getPollByIdService,
  getMyPollsService,
  updatePollService,
  deletePollService,
  endPollService,
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

export const updatePoll =   asyncHandler(

    async (req, res) => {

      const poll =
        await updatePollService(

          req.params.id,

          req.user._id,

          req.body
        );

      return res.status(200).json(

        new ApiResponse(

          200,

          "Poll updated successfully",

          poll
        )
      );
    }
  );

export const deletePoll = asyncHandler(
  async (
    req,
    res
  ) => {

    await deletePollService(

      req.params.id,

      req.user._id
    );

    return res.status(200).json({

      success: true,

      statusCode: 200,

      message:
        "Poll deleted successfully",
    });
  }
);

export const endPoll = asyncHandler(
  async (
    req,
    res
  ) => {

    const updatedPoll =
      await endPollService(

        req.params.id,

        req.user._id
      );

    return res.status(200).json({

      success: true,

      statusCode: 200,

      message:
        "Poll ended successfully",

      data: updatedPoll,
    });
  }
);
