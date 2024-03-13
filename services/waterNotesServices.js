import WaterNote from "../models/WaterNote.js";

export function listWaterNotes() {
  return WaterNote.find({}, "-__v");
}

export function getWaterNotesByFilter(filter, query = {}) {
  return WaterNote.find(filter, "-__v", query);
}

export function getWaterNotesCountByFilter(filter) {
  return WaterNote.countDocuments(filter);
}

export function getWaterNoteById(id) {
  return WaterNote.findById(id, "-__v");
}

export function getOneWaterNoteByFilter(filter) {
  return WaterNote.findOne(filter, "-__v");
}

export function removeWaterNote(id) {
  return WaterNote.findByIdAndDelete(id);
}

export function removeWaterNoteByFilter(filter) {
  return WaterNote.findOneAndDelete(filter);
}

export function addWaterNote(data) {
  return WaterNote.create(data);
}

export function editWaterNote(id, data) {
  return WaterNote.findByIdAndUpdate(id, data);
}

export function editWaterNoteByFilter(filter, data) {
  return WaterNote.findOneAndUpdate(filter, data);
}

export function updateWaterNoteStatus(id, body) {
  return WaterNote.findByIdAndUpdate(id, body);
}

export function updateWaterNoteStatusByFilter(filter, body) {
  return WaterNote.findByIdAndUpdate(filter, body);
}
