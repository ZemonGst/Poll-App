export const pollDto = (poll) => {

  return {

    id: poll._id,

    title: poll.title,

    description:
      poll.description,

    options: poll.options,

    totalVotes:
      poll.totalVotes,

    visibility:
      poll.visibility,

    pollType:
      poll.pollType,

    status:
      poll.status,

    allowAnonymousVotes:
      poll.allowAnonymousVotes,

    allowMultipleVotes:
      poll.allowMultipleVotes,

    expiresAt:
      poll.expiresAt,

    tags: poll.tags,

    analytics:
      poll.analytics,

    createdBy:
      poll.createdBy,

    createdAt:
      poll.createdAt,

    updatedAt:
      poll.updatedAt,
  };
};