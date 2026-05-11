export const pollLeaderboardDto =
  (

    poll,

    leaderboard
  ) => {

    return {

      id: poll._id,

      title: poll.title,

      status: poll.status,

      showLeaderboard:
        poll.showLeaderboard,

      leaderboard,
    };
  };