import Poll from "../models/Poll.js";

import { pollDto } from "../dto/poll.dto.js";

import NotFoundError from "../errors/NotFoundError.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";
import BadRequestError from "../errors/BadRequestError.js";






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
export const updatePollService = async (pollId, userId, updateData) => {
  const poll = await Poll.findById(pollId);
  if (!poll) {
    throw new NotFoundError("Poll not found");
  }

  if (poll.createdBy.toString() !== userId.toString()) {
    throw new UnauthorizedError("You are not authorized to update this poll");
  }

  // Define fields that are allowed to be updated
const allowedFields = [

  "title",

  "description",

  "options",

  "visibility",

  "pollType",

  "allowAnonymousVotes",

  "allowMultipleVotes",

  "showLeaderboard",

  "showAdvancedAnalytics",

  "leaderboardLimit",

  "timerDuration",

  "expiresAt",

  "tags",
];

  const filteredUpdates = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredUpdates[field] = updateData[field];
    }
  });

  Object.assign(poll, filteredUpdates);
  await poll.save();

  return pollDto(poll); 
};

export const deletePollService = async (
  pollId,
  userId
) => {

  const poll =
    await Poll.findById(pollId);

  if (!poll) {

    throw new NotFoundError(
      "Poll not found"
    );
  }

  if (
    poll.createdBy.toString()
    !== userId.toString()
  ) {

    throw new UnauthorizedError(
      "You are not authorized to delete this poll"
    );
  }

  await poll.deleteOne();

  return;
};

export const endPollService = async (
  pollId,
  userId
) => {

  const poll =
    await Poll.findById(pollId);

  if (!poll) {

    throw new NotFoundError(
      "Poll not found"
    );
  }

  if (
    poll.createdBy.toString()
    !== userId.toString()
  ) {

    throw new UnauthorizedError(
      "You are not authorized to end this poll"
    );
  }

  poll.status = "ended";

  await poll.save();

  return pollDto(poll);
};

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