import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const waterNoteSchema = new Schema({
  date: {
    type: String,
    required: [true, "Set date for water note"],
  },
  waterVolume: {
    type: String,
    required: [true, "Set water volume for water note"],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

waterNoteSchema.post("save", handleSaveError);

waterNoteSchema.pre("findOneAndUpdate", setUpdateSettings);
waterNoteSchema.post("findOneAndUpdate", handleSaveError);

const WaterNote = model("water-note", waterNoteSchema);

export default WaterNote;
