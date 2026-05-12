import { getIO }
  from "../socket/socketServer.js";

import {
  getPollRoomName,
} from "../socket/socketRooms.js";

export const emitAnalyticsUpdate =
  ({ pollId, analyticsData }) => {

    const io = getIO();

    const roomName =
      getPollRoomName(pollId);

    io.to(roomName).emit(
      "analytics-update",
      analyticsData
    );

    console.log(
      `Analytics update emitted to ${roomName}`
    );
  };

export const emitLeaderboardUpdate =
  ({ pollId, leaderboardData }) => {

    const io = getIO();

    const roomName =
      getPollRoomName(pollId);

    io.to(roomName).emit(
      "leaderboard-update",
      leaderboardData
    );

    console.log(
      `Leaderboard update emitted to ${roomName}`
    );
  };