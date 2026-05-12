import Joi from "joi";

export const votePollSchema =   Joi.object({

    optionId:

      Joi.string()
        .trim()
        .required(),
  });
