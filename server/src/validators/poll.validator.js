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

    expiresAt: Joi.date()
      .allow(null),

    tags: Joi.array()
      .items(
        Joi.string().trim()
      )
      .default([]),
  });

export const votePollSchema =

  Joi.object({

    optionId:

      Joi.string()
        .trim()
        .required(),
  });