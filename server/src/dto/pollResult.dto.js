export const pollResultDto = (

  poll,

  isPollOwner = false
) => {

  const canViewResults =

    isPollOwner ||

    poll.status === "ended";

  return {

    id: poll._id,

    title: poll.title,

    description:
      poll.description,

    status:
      poll.status,

    totalVotes:

      canViewResults

        ? poll.totalVotes

        : undefined,

    options:

      poll.options.map(
        (option) => ({

          id: option._id,

          text: option.text,

          voteCount:

            canViewResults

              ? option.voteCount

              : undefined,
        })
      ),

    analytics:

      canViewResults &&

      poll.showAdvancedAnalytics

        ? {

            uniqueParticipants:

              poll.analytics
                .uniqueParticipants,

            authenticatedVotes:

              poll.analytics
                .authenticatedVotes,

            anonymousVotes:

              poll.analytics
                .anonymousVotes,
          }

        : undefined,

    showLeaderboard:
      poll.showLeaderboard,

    showAdvancedAnalytics:
      poll.showAdvancedAnalytics,

    createdAt:
      poll.createdAt,

    updatedAt:
      poll.updatedAt,
  };
};