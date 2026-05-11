import Joi from "joi";

export const createPollSchema =   Joi.object({

    title: Joi.string()
      .trim()
      .min(3)
      .max(200),

    description: Joi.string()
      .trim()
      .max(1000)
      .allow(""),

    options: Joi.array()
      .items(

        Joi.object({

          text: Joi.string()
            .trim()
            .min(1)
            .max(200),
        })
      )
      .min(2),

    visibility: Joi.string()
      .valid(
        "public",
        "private"
      )
      .default("public"),

    pollType: Joi.string()
      .valid(
        "single-choice",
        "multiple-choice"
      )
      .default("single-choice"),

    allowAnonymousVotes:
      Joi.boolean()
        .default(false),

    allowMultipleVotes:
      Joi.boolean()
        .default(false),

    showLeaderboard:
      Joi.boolean()
        .default(false),

    showAdvancedAnalytics:
      Joi.boolean()
        .default(false),

    leaderboardLimit:
      Joi.number()
        .min(1)
        .max(100)
        .default(10),

    timerDuration:
      Joi.number()
        .min(1)
        .max(30)
        .default(1),

    expiresAt:
      Joi.date()
        .allow(null),

    tags: Joi.array()
      .items(
        Joi.string().trim()
      )
      .default([]),
  });


export const votePollSchema =   Joi.object({

    optionId:

      Joi.string()
        .trim()
        .required(),
  });


export const updatePollSchema =   Joi.object({

    title:
      Joi.string()
        .trim()
        .min(3)
        .max(200),

    description:
      Joi.string()
        .trim()
        .max(1000)
        .allow(""),

    visibility:
      Joi.string()
        .valid(
          "public",
          "private"
        ),

    pollType:
      Joi.string()
        .valid(
          "single-choice",
          "multiple-choice"
        ),

    allowAnonymousVotes:
      Joi.boolean(),

    allowMultipleVotes:
      Joi.boolean(),

    showLeaderboard:
      Joi.boolean(),

    showAdvancedAnalytics:
      Joi.boolean(),

    leaderboardLimit:
      Joi.number()
        .min(1)
        .max(100),

    timerDuration:
      Joi.number()
        .min(1)
        .max(30),

    expiresAt:
      Joi.date()
        .allow(null),

    tags:
      Joi.array()
        .items(
          Joi.string().trim()
        ),
  });
