import database from "../../database";

// utils
import logger from "../../utils/logger";

interface GetVotesOptions {
  viewVoters?: boolean;
}

export async function getVotes(
  postId: string,
  userId?: string,
  options: GetVotesOptions = {},
) {
  try {
    const votesCount = (await database
      .count("voteId")
      .from("votes")
      .where({
        postId,
      })
      .first()) as { count: string };

    // Only fetch voter details if view_voters is enabled
    let votes = [];
    if (options.viewVoters !== false) {
      votes = await database
        .select("votes.*", "users.name", "users.username", "users.avatar")
        .from("votes")
        .innerJoin("users", "votes.userId", "users.userId")
        .where({
          postId,
        })
        .limit(6);
    }

    const viewerVote = userId
      ? await database
          .select()
          .from("votes")
          .where({
            postId,
            userId,
          })
          .first()
      : undefined;

    return {
      votes,
      votesCount: Number.parseInt(votesCount.count, 10),
      viewerVote,
    };
  } catch (err) {
    logger.log({
      level: "error",
      message: err,
    });
  }
}
