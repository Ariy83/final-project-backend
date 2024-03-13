import Joi from "joi";

const createWaterNotesSchema = Joi.object({
  date: Joi.string().required(),
  waterVolume: Joi.number().min(1).max(5000).required(),
});

const updateWaterNotesSchema = Joi.object({
  date: Joi.string(),
  waterVolume: Joi.number().min(1).max(5000),
});

export default { createWaterNotesSchema, updateWaterNotesSchema };
