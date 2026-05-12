import Poll from "../../../polling/poll/models/Poll.js";

import { pollDto } from "../../../polling/poll/dto/poll.dto.js";

import NotFoundError from "../../../../common/errors/NotFoundError.js";
import BadRequestError from "../../../../common/errors/BadRequestError.js";

export const votePollService = async (

  pollId,

  optionId,

  user,

  sessionId
) => {

  const poll =
    await Poll.findById(pollId);

  if (!poll) {

    throw new NotFoundError(
      "Poll not found"
    );
  }

  if (
    poll.status === "ended"
  ) {

    throw new BadRequestError(
      "Poll has already ended"
    );
  }

  const selectedOption =
    poll.options.id(optionId);

  if (!selectedOption) {

    throw new NotFoundError(
      "Option not found"
    );
  }

  const alreadyVoted =
    poll.options.some((option) =>

      option.voters.some((voter) => {

        if (user) {

          return (
            voter.userId?.toString()
            === user._id.toString()
          );
        }

        return (
          voter.sessionId
          === sessionId
        );
      })
    );

  if (alreadyVoted) {

    throw new BadRequestError(
      "You have already voted"
    );
  }

  selectedOption.voteCount += 1;

  selectedOption.voters.push({

    userId:
      user ? user._id : null,

    sessionId:
      user ? null : sessionId,

    isAnonymous:
      !user,
  });

  poll.totalVotes += 1;

  if (user) {

    poll.analytics
      .authenticatedVotes += 1;

  } else {

    poll.analytics
      .anonymousVotes += 1;
  }

  poll.analytics
    .uniqueParticipants += 1;

  await poll.save();

  return pollDto(poll);
};
