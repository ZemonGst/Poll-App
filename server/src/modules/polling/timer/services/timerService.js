import Poll from "../../poll/models/Poll.js";
import NotFoundError from "../../../../common/errors/NotFoundError.js";
import { timerDto } from "../dto/timer.dto.js";

export const getPollTimerService = async (pollId) => {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw new NotFoundError("Poll not found");
  }

  return timerDto(poll);
};
