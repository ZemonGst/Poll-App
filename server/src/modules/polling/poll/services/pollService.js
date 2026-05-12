import Poll from "../models/Poll.js";
import User from "../../../auth/models/User.js";

import { pollDto } from "../dto/poll.dto.js";

import {
  emitPollUpdate,
  emitPollEnded,
} from "../../../realtime/handlers/pollRealtime.handler.js";

import NotFoundError from "../../../../common/errors/NotFoundError.js";
import UnauthorizedError from "../../../../common/errors/UnauthorizedError.js";

import generateShareCode from "../../../../common/utils/generateShareCode.js";

export const createPollService = async (pollData) => {
  const {
    title,
    description,
    options,
    visibility,
    pollType,
    allowAnonymousVotes,
    allowMultipleVotes,
    showLeaderboard,
    showAdvancedAnalytics,
    leaderboardLimit,
    timerDuration = 30,
    tags,
    createdBy,
  } = pollData;

  let expiresAt = pollData.expiresAt;

  if (!expiresAt) {
    expiresAt = new Date(Date.now() + timerDuration * 1000);
  }

  let shareCode;

  let existingPoll;

  do {

    shareCode =
      generateShareCode();

    existingPoll =
      await Poll.findOne({
        shareCode,
      });

  } while (existingPoll);

  const poll =
    await Poll.create({

      title,

      description,

      options,

      visibility,

      pollType,

      allowAnonymousVotes,

      allowMultipleVotes,

      showLeaderboard,

      showAdvancedAnalytics,

      leaderboardLimit,

      timerDuration,

      expiresAt,

      tags,

      shareCode,

      createdBy,
    });

  await User.findByIdAndUpdate(
    createdBy,
    {
      $push: {
        createdPolls: poll._id,
      },
    }
  );

  return pollDto(poll);
};

export const getPollByIdService = async (
  pollId
) => {

  const poll =
    await Poll.findById(pollId);

  if (!poll) {

    throw new NotFoundError(
      "Poll not found"
    );
  }

  return pollDto(poll);
};

export const getMyPollsService = async (
  userId
) => {

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

export const updatePollService = async (
  pollId,
  userId,
  updateData
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
      "You are not authorized to update this poll"
    );
  }

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

    if (
      updateData[field]
      !== undefined
    ) {

      filteredUpdates[field] =
        updateData[field];
    }
  });

  Object.assign(
    poll,
    filteredUpdates
  );

  await poll.save();

  emitPollUpdate({

    pollId: poll._id,

    poll,
  });

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