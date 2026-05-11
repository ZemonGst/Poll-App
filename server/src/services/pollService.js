import Poll from "../models/Poll.js";

import { pollDto } from "../dto/poll.dto.js";

import NotFoundError from "../errors/NotFoundError.js";
import UnauthorizedError from "../errors/UnauthorizedError.js";






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
    "expiresAt",
    "tags"
  ];

  const filteredUpdates = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredUpdates[field] = updateData[field];
    }
  });

  Object.assign(poll, filteredUpdates);
  await poll.save();

  return pollDto(poll); // Ensure we return the DTO as before.
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
