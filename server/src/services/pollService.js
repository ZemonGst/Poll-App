import Poll from "../models/Poll.js";

import { pollDto } from "../dto/poll.dto.js";

import NotFoundError from "../errors/NotFoundError.js";






export const createPollService = async ({
    title,
    description,
    options,
    visibility,
    pollType,
    allowAnonymousVotes,
    allowMultipleVotes,
    expiresAt,
    tags,
    createdBy,
  }) => {

    const poll =
      await Poll.create({

        title,

        description,

        options,

        visibility,

        pollType,

        allowAnonymousVotes,

        allowMultipleVotes,

        expiresAt,

        tags,

        createdBy,
      });





    return pollDto(poll);
  };
  
export const getPollByIdService =  async (pollId) => {

    const poll =
      await Poll.findById(pollId);





    if (!poll) {

      throw new NotFoundError(
        "Poll not found"
      );
    }





    return pollDto(poll);
  };  
export const getMyPollsService =   async (userId) => {

    const polls =
      await Poll.find({

        createdBy: userId,
      })

      .sort({
        createdAt: -1,
      });





    return polls.map((poll) =>
      pollDto(poll)
    );
  };

