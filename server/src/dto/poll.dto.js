export const pollDto = (poll) => {

  return {

    id: poll._id,

    title: poll.title,

    description:
      poll.description,

    options:
      poll.options.map(
        (option) => ({

          id: option._id,

          text: option.text,

          voteCount:
            option.voteCount,
        })
      ),

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

    showLeaderboard:
      poll.showLeaderboard,

    showAdvancedAnalytics:
      poll.showAdvancedAnalytics,

    leaderboardLimit:
      poll.leaderboardLimit,

    timerDuration:
      poll.timerDuration,

    expiresAt:
      poll.expiresAt,

    tags:
      poll.tags,

    analytics: {

      views:
        poll.analytics.views,

      shares:
        poll.analytics.shares,

      uniqueParticipants:
        poll.analytics
          .uniqueParticipants,

      authenticatedVotes:
        poll.analytics
          .authenticatedVotes,

      anonymousVotes:
        poll.analytics
          .anonymousVotes,
    },

    createdBy:
      poll.createdBy,

    createdAt:
      poll.createdAt,

    updatedAt:
      poll.updatedAt,
  };
};