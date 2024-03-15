import Joi from "joi";

const createWaterNotesSchema = Joi.object({
  time: Joi.string().required(),
  waterVolume: Joi.number().min(1).max(5000).required(),
});

const updateWaterNotesSchema = Joi.object({
  time: Joi.string(),
  waterVolume: Joi.number().min(1).max(5000),
});

export default { createWaterNotesSchema, updateWaterNotesSchema };
