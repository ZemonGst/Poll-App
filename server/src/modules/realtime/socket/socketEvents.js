import {
  joinPollRoom,
  leavePollRoom,
} from "./socketRooms.js";

export const registerSocketEvents =
  (io, socket) => {

    console.log(
      `Socket connected: ${socket.id}`
    );

    socket.on(
      "join-poll",
      ({ pollId }) => {

        joinPollRoom(
          socket,
          pollId
        );
      }
    );

    socket.on(
      "leave-poll",
      ({ pollId }) => {

        leavePollRoom(
          socket,
          pollId
        );
      }
    );

    socket.on(
      "disconnect",
      () => {

        console.log(
          `Socket disconnected: ${socket.id}`
        );
      }
    );
  };