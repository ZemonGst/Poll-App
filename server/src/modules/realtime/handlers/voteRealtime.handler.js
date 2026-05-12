import { getIO }
  from "../socket/socketServer.js";

import {
  getPollRoomName,
} from "../socket/socketRooms.js";

export const emitVoteUpdate =
  ({ pollId, voteData }) => {

    const io = getIO();

    const roomName =
      getPollRoomName(pollId);

    io.to(roomName).emit(
      "vote-update",
      voteData
    );

    console.log(
      `Vote update emitted to ${roomName}`
    );
  };