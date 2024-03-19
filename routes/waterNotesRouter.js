import express from "express";
import authenticate from "../middlewares/authenticate.js";
import validateBody from "../decorators/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import validateQuery from "../middlewares/queryValidation.js";
import {
  addAllWaterNotes,
  updateWaterNote,
  deleteWaterNote,
  getTodayWaterNote,
  monthInfoWaterNote,
} from "../controllers/waterNotesControllers.js";
import todayDatevalidation from "../helpers/todayDatevalidation.js";

const waterNotesRouter = express.Router();

waterNotesRouter.use(authenticate);

waterNotesRouter.get(
  "/month",
  validateQuery(todayDatevalidation),
  monthInfoWaterNote
);

waterNotesRouter.get(
  "/today",
  validateQuery(todayDatevalidation),
  getTodayWaterNote
);

waterNotesRouter.delete("/id", isValidId.forId, deleteWaterNote);

waterNotesRouter.post("/", validateBody(validateBody), addAllWaterNotes);

waterNotesRouter.put(
  "/update/:Id",
  isValidId.forId,
  validateBody(validateBody),
  updateWaterNote
);

export default waterNotesRouter;
