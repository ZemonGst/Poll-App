export const timerDto = (poll) => {
  return {
    id: poll._id,
    timerDuration: poll.timerDuration,
    expiresAt: poll.expiresAt,
    status: poll.status,
  };
};
