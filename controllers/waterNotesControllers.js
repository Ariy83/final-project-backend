import {
  getWaterNotesByFilter,
  getOneWaterNoteByFilter,
  removeWaterNoteByFilter,
  addWaterNote,
  editWaterNoteByFilter,
  updateWaterNoteStatusByFilter,
  getWaterNotesCountByFilter,
} from "../services/waterNotesServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const getAllWaterNotes = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = limit * (page - 1);

  const { favorite } = req.query;

  if (favorite) {
    const total = await getWaterNotesCountByFilter({ owner, favorite });
    const result = await getWaterNotesByFilter(
      { owner, favorite },
      { skip, limit }
    );
    res.json({ total, result });
  } else {
    const total = await getWaterNotesCountByFilter({ owner });
    const result = await getWaterNotesByFilter({ owner }, { skip, limit });
    res.json({ total, result });
  }
};

const getOneWaterNote = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await getOneWaterNoteByFilter({ _id: id, owner });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const deleteWaterNote = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await removeWaterNoteByFilter({ _id: id, owner });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const createWaterNote = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await addWaterNote({ ...req.body, owner });
  res.status(201).json(result);
};

const updateWaterNote = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await editWaterNoteByFilter({ _id: id, owner }, req.body);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const updateStatusWaterNote = async (req, res) => {
  const { WaterNoteId } = req.params;
  const { _id: owner } = req.user;
  const result = await updateWaterNoteStatusByFilter(
    { _id: WaterNoteId, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

export default {
  getAllWaterNotes: ctrlWrapper(getAllWaterNotes),
  getOneWaterNote: ctrlWrapper(getOneWaterNote),
  deleteWaterNote: ctrlWrapper(deleteWaterNote),
  createWaterNote: ctrlWrapper(createWaterNote),
  updateWaterNote: ctrlWrapper(updateWaterNote),
  updateStatusWaterNote: ctrlWrapper(updateStatusWaterNote),
};
