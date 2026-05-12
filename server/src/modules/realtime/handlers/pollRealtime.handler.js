import { getIO }
  from "../socket/socketServer.js";

import {
  getPollRoomName,
} from "../socket/socketRooms.js";

export const emitPollUpdate =
  ({ pollId, pollData }) => {

    const io = getIO();

    const roomName =
      getPollRoomName(pollId);

    io.to(roomName).emit(
      "poll-update",
      pollData
    );

    console.log(
      `Poll update emitted to ${roomName}`
    );
  };

export const emitPollEnded =
  ({ pollId, pollData }) => {

    const io = getIO();

    const roomName =
      getPollRoomName(pollId);

    io.to(roomName).emit(
      "poll-ended",
      pollData
    );

    console.log(
      `Poll ended emitted to ${roomName}`
    );
  };