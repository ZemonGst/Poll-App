import Poll from "../../poll/models/Poll.js";
import User from "../../../auth/models/User.js";

import NotFoundError from "../../../../common/errors/NotFoundError.js";

import {
  pollLeaderboardDto,
} from "../dto/pollLeaderboard.dto.js";

export const getPollLeaderboardService = async (pollId) => {

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

    const sortedVoters =

      allVoters

        .sort(
          (a, b) =>

            new Date(a.votedAt)
            -
            new Date(b.votedAt)
        )

        .slice(0, poll.leaderboardLimit || 10);

    // BUG 5 FIX: Populate actual user names for authenticated voters
    const leaderboard = await Promise.all(

      sortedVoters.map(

        async (
          voter,
          index
        ) => {

          let participantName =
            "Anonymous User";

          if (
            !voter.isAnonymous &&
            voter.userId
          ) {

            const user =
              await User.findById(
                voter.userId
              );

            if (user) {

              participantName =
                user.name;
            }
          }

          return {

            rank:
              index + 1,

            votedAt:
              voter.votedAt,

            optionText:
              voter.optionText,

            participant:
              participantName,
          };
        }
      )
    );

    return pollLeaderboardDto(

      poll,

      leaderboard
    );
  };

