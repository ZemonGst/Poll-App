import { pollRealtimeDto } from "../dto/pollRealtime.dto.js";
import { getIO } from "../socket/socketServer.js";
import { getPollRoomName } from "../socket/socketRooms.js";

export const emitVoteUpdate = ({ pollId, poll }) => {
  const io = getIO();
  const roomName = getPollRoomName(pollId);

  io.to(roomName).emit("vote-update", pollRealtimeDto(poll));

  console.log(`Vote update emitted to ${roomName}`);
};