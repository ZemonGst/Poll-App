import Poll
  from "../../poll/models/Poll.js";

import {
  sharePollDto,
} from "../dto/sharePoll.dto.js";

import NotFoundError
  from "../../../../common/errors/NotFoundError.js";

export const getPollByShareCodeService =
  async (shareCode) => {

    const poll =
      await Poll.findOne({

        shareCode:
          shareCode.toUpperCase(),
      });

    if (!poll) {

      throw new NotFoundError(
        "Poll not found"
      );
    }

    poll.analytics.shares += 1;

    await poll.save();

    return sharePollDto(poll);
  };