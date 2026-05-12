import { pollRealtimeDto } from "../dto/pollRealtime.dto.js";
import { getIO } from "../socket/socketServer.js";
import { getPollRoomName } from "../socket/socketRooms.js";

export const emitPollUpdate = ({ pollId, poll }) => {
  const io = getIO();
  const roomName = getPollRoomName(pollId);

  io.to(roomName).emit("poll-update", pollRealtimeDto(poll));

  console.log(`Poll update emitted to ${roomName}`);
};

export const emitPollEnded = ({ pollId, poll }) => {
  const io = getIO();
  const roomName = getPollRoomName(pollId);

  io.to(roomName).emit("poll-ended", pollRealtimeDto(poll));

  console.log(`Poll ended emitted to ${roomName}`);
};