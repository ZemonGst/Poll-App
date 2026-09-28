export const pollRealtimeDto = (poll) => {
  return {
    id: poll._id.toString(),
    title: poll.title,
    status: poll.status,
    totalVotes: poll.totalVotes,
    expiresAt: poll.expiresAt,
    options: poll.options.map((option) => ({
      id: option._id.toString(),
      text: option.text,
      voteCount: option.voteCount,
    })),
  };
};
