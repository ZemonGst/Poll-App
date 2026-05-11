import Poll from "../models/Poll.js";

import { pollDto }
from "../dto/poll.dto.js";






export const createPollService =
  async ({
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