import { io }
  from "socket.io-client";

const socket =
  io("http://localhost:8000");

const pollId =
  "6a02ecfcac6f2f364547439d";

socket.on(
  "connect",
  () => {

    console.log(
      "Connected:",
      socket.id
    );

    socket.emit(
      "join-poll",
      { pollId }
    );
  }
);

socket.on(
  "vote-update",
  (data) => {

    console.log(
      "\nVOTE UPDATE:"
    );

    console.log(data);
  }
);

socket.on(
  "analytics-update",
  (data) => {

    console.log(
      "\nANALYTICS UPDATE:"
    );

    console.log(data);
  }
);

socket.on(
  "poll-update",
  (data) => {

    console.log(
      "\nPOLL UPDATE:"
    );

    console.log(data);
  }
);

socket.on(
  "poll-ended",
  (data) => {

    console.log(
      "\nPOLL ENDED:"
    );

    console.log(data);
  }
);

socket.on(
  "disconnect",
  () => {

    console.log(
      "Disconnected"
    );
  }
);