import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000', {
      autoConnect: false,
      withCredentials: true,
    });
  }
  return socket;
};

// Socket event name constants
export const SOCKET_EVENTS = {
  JOIN_POLL: 'join-poll',
  LEAVE_POLL: 'leave-poll',
  VOTE_UPDATE: 'vote-update',
  RESULTS_UPDATE: 'results-update',
  LEADERBOARD_UPDATE: 'leaderboard-update',
  ANALYTICS_UPDATE: 'analytics-update',
  POLL_ENDED: 'poll-ended',
  TIMER_TICK: 'timer-tick',
};
