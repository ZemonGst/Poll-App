export const pollAnalyticsDto =
  (poll) => {

    return {

      id: poll._id,

      title: poll.title,

      status: poll.status,

      totalVotes:
        poll.totalVotes,

      analytics: {

        uniqueParticipants:

          poll.analytics
            .uniqueParticipants,

        authenticatedVotes:

          poll.analytics
            .authenticatedVotes,

        anonymousVotes:

          poll.analytics
            .anonymousVotes,

        views:
          poll.analytics.views,

        shares:
          poll.analytics.shares,
      },

      createdAt:
        poll.createdAt,

      updatedAt:
        poll.updatedAt,
    };
  };
