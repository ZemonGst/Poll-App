export const getPollRoomName =
  (pollId) => {

    return `poll:${pollId}`;
  };

export const joinPollRoom =
  (socket, pollId) => {

    const roomName =
      getPollRoomName(pollId);

    socket.join(roomName);

    console.log(
      `Socket ${socket.id} joined ${roomName}`
    );

    return roomName;
  };

export const leavePollRoom =
  (socket, pollId) => {

    const roomName =
      getPollRoomName(pollId);

    socket.leave(roomName);

    console.log(
      `Socket ${socket.id} left ${roomName}`
    );

    return roomName;
  };