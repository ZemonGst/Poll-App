import Poll
from "../models/Poll.js";

import NotFoundError
from "../errors/NotFoundError.js";

import {
  pollLeaderboardDto,
} from "../dto/pollLeaderboard.dto.js";

export const getPollLeaderboardService =   async (pollId) => {

    const poll =
      await Poll.findById(
        pollId
      );

    if (!poll) {

      throw new NotFoundError(
        "Poll not found"
      );
    }

    if (
      !poll.showLeaderboard
    ) {

      return pollLeaderboardDto(

        poll,

        []
      );
    }

    const allVoters = [];

    poll.options.forEach(
      (option) => {

        option.voters.forEach(
          (voter) => {

            allVoters.push({

              votedAt:
                voter.votedAt,

              isAnonymous:
                voter.isAnonymous,

              userId:
                voter.userId,

              optionText:
                option.text,
            });
          }
        );
      }
    );

    const leaderboard =

      allVoters

        .sort(
          (a, b) =>

            new Date(a.votedAt)
            -
            new Date(b.votedAt)
        )

        .slice(0, 10)

        .map(

          (
            voter,
            index
          ) => ({

            rank:
              index + 1,

            votedAt:
              voter.votedAt,

            optionText:
              voter.optionText,

            participant:

              voter.isAnonymous

                ? "Anonymous User"

                : voter.userId,
          })
        );

    return pollLeaderboardDto(

      poll,

      leaderboard
    );
  };
