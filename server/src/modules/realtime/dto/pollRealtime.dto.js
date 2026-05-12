export const pollRealtimeDto = (poll) => {
  return {
    id: poll._id,
    title: poll.title,
    status: poll.status,
    totalVotes: poll.totalVotes,
    expiresAt: poll.expiresAt,
    options: poll.options.map((option) => ({
      id: option._id,
      text: option.text,
      voteCount: option.voteCount,
    })),
  };
};
