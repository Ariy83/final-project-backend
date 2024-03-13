import Joi from "joi";

export const createWaterNotes = Joi.object({
  date: Joi.string().required(),
  waterVolume: Joi.string().required(),
});

export const updateWaterNotes = Joi.object({
  date: Joi.string().required(),
  waterVolume: Joi.string().required(),
});

export const updateFavContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
