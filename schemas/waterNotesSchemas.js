import Joi from "joi";

const createWaterNotesSchema = Joi.object({
  time: Joi.string().required(),
  waterVolume: Joi.number().min(1).max(5000).required(),
});

const updateWaterNotesSchema = Joi.object({
  time: Joi.string(),
  waterVolume: Joi.number().min(1).max(5000),
});

const validateInput = Joi.object({
  year: Joi.number().integer().min(1900).max(2100).required(),
  month: Joi.number().integer().min(1).max(12).required(),
});

const bodyValidation = Joi.object({
  waterAmount: Joi.number()
    .min(1)
    .max(5000)
    .required()
    .messages({ "any.required": "missing required waterAmount field" }),
  date: Joi.string()
    .required()
    .messages({ "any.required": "missing required date field" }),
});

const todayDatevalidation = Joi.object({
  date: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": '"date" must be in the "yyyy-mm-dd" format',
    }),
});

export default {
  createWaterNotesSchema,
  updateWaterNotesSchema,
  validateInput,
  bodyValidation,
  todayDatevalidation,
};
