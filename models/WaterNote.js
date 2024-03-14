import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const waterNoteSchema = new Schema(
  {
    notes: [
      {
        time: {
          type: String,
          required: [true, "Set time for water note"],
        },
        waterVolume: {
          type: Number,
          required: [true, "Set water volume for water note"],
        },
      },
    ],

    date: {
      type: Date,
      default: new Date(),
    },

    totalWaterVolume: {
      type: Number,
      default: 0,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

waterNoteSchema.post("save", handleSaveError);

waterNoteSchema.pre("findOneAndUpdate", setUpdateSettings);
waterNoteSchema.post("findOneAndUpdate", handleSaveError);

const WaterNote = model("water-note", waterNoteSchema);

export default WaterNote;
