import Joi from "joi";

const createWaterNotesSchema = Joi.object({
  notes: Joi.array().items(
    Joi.object({
      time: Joi.string().required(),
      waterVolume: Joi.number().min(1).max(5000).required(),
    })
  ),
  date: Joi.date(),
  totalWaterVolume: Joi.number(),
});

const updateWaterNotesSchema = Joi.object({
  notes: Joi.array().items(
    Joi.object({
      time: Joi.string(),
      waterVolume: Joi.number().min(1).max(5000),
    })
  ),
  date: Joi.date(),
  totalWaterVolume: Joi.number(),
});

export default { createWaterNotesSchema, updateWaterNotesSchema };
