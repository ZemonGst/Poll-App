import Poll
from "../models/Poll.js";

import NotFoundError
from "../errors/NotFoundError.js";

import UnauthorizedError
from "../errors/UnauthorizedError.js";

import {
  pollAnalyticsDto,
} from "../dto/pollAnalytics.dto.js";

export const getPollAnalyticsService =  async (

    pollId,

    userId
  ) => {

    const poll =
      await Poll.findById(
        pollId
      );

    if (!poll) {

      throw new NotFoundError(
        "Poll not found"
      );
    }

    const isPollOwner =

      poll.createdBy.toString()
      === userId.toString();

    if (!isPollOwner) {

      throw new UnauthorizedError(

        "You are not authorized to view analytics"
      );
    }

    return pollAnalyticsDto(
      poll
    );
  };
 