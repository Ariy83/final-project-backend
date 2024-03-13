import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const contactSchema = new Schema({
  date: {
    type: String,
    required: [true, "Set name for contact"],
  },
  waterVolume: {
    type: String,
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", setUpdateSettings);
contactSchema.post("findOneAndUpdate", handleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;
