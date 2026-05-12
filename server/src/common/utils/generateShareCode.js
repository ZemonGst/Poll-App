const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateShareCode = (length = 6) => {

  let shareCode = "";

  for (let i = 0; i < length; i++) {

    const randomIndex =
      Math.floor(
        Math.random() * CHARACTERS.length
      );

    shareCode +=
      CHARACTERS[randomIndex];
  }

  return shareCode;
};

export default generateShareCode;