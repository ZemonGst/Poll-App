import Poll from "../../poll/models/Poll.js";

import NotFoundError from "../../../../common/errors/NotFoundError.js";

import {
  pollResultDto,
} from "../dto/pollResult.dto.js";

export const getPollResultsService =
  async (

    pollId,

    userId = null
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

      userId &&

      poll.createdBy.toString()
      === userId.toString();

    return pollResultDto(

      poll,

      isPollOwner
    );
  };
