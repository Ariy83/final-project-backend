import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const waterNoteSchema = new Schema(
  {
    waterAmount: {
      type: Number,
      required: [true, "WaterAmount is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);
waterNoteSchema.post("save", handleSaveError);

waterNoteSchema.pre("findOneAndUpdate", setUpdateSettings);
waterNoteSchema.post("findOneAndUpdate", handleSaveError);

const Water = model("water-note", waterNoteSchema);

export default Water;
