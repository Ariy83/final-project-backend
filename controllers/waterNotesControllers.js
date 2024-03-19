import {
  addWaterService,
  updateWaterService,
  deleteWaterService,
  getWaterConsumptionDaySummary,
  getWaterConsumptionMonthSummary,
} from "../services/waterNotesServices.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";

export async function addAllWaterNotes(req, res) {
  const { _id: owner } = req.user;

  const newWaterNote = await addWaterService({ ...req.body, owner });
  res.status(201).json(newWaterNote);
}

export async function updateWaterNote(req, res) {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const updatedWaterById = await updateWaterService(id, owner, req.body);
  if (!updatedWaterById) {
    throw HttpError(404, "Not Found");
  }
  res.status(200).json(updatedWaterById);
}

export async function deleteWaterNote(req, res) {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const deletedWater = await deleteWaterService(id, owner);
  if (!deletedWater) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ massage: "Water deleted" });
}

export async function getTodayWaterNote(req, res) {
  const { _id: owner } = req.user;
  const { date } = req.query;
  const waterConsumptionArray = await getWaterConsumptionDaySummary(
    owner,
    date
  );
  res.status(200).json(waterConsumptionArray[0]);
}
export async function monthInfoWaterNote(req, res) {
  const { _id: owner } = req.user;
  const { year, month } = req.query;

  const waterConsumptionMonth = await getWaterConsumptionMonthSummary(
    owner,
    year,
    month
  );
  res.status(200).json(waterConsumptionMonth);
}

export default {
  addAllWaterNotes: ctrlWrapper(addAllWaterNotes),
  updateWaterNote: ctrlWrapper(updateWaterNote),
  deleteWaterNote: ctrlWrapper(deleteWaterNote),
  getTodayWaterNote: ctrlWrapper(getTodayWaterNote),
  monthInfoWaterNote: ctrlWrapper(monthInfoWaterNote),
};
