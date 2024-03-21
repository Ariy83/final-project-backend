import express from "express";
import authenticate from "../middlewares/authenticate.js";
import validateBody from "../decorators/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import {
  addAllWaterNotes,
  updateWaterNote,
  deleteWaterNote,
  getTodayWaterNote,
  monthInfoWaterNote,
} from "../controllers/waterNotesControllers.js";
import waterSchemas from "../schemas/waterNotesSchemas.js";
import validateQuery from "../middlewares/queryValidation.js";

const waterNotesRouter = express.Router();

waterNotesRouter.use(authenticate);

waterNotesRouter.get(
  "/month",
  validateQuery(waterSchemas.validateInput),
  monthInfoWaterNote
);

waterNotesRouter.get(
  "/today",
  validateQuery(waterSchemas.todayDatevalidation),
  getTodayWaterNote
);

waterNotesRouter.delete("/:id", isValidId.forId, deleteWaterNote);

waterNotesRouter.post(
  "/",
  validateBody(waterSchemas.bodyValidation),
  addAllWaterNotes
);

waterNotesRouter.put(
  "/:id",
  isValidId.forId,
  validateBody(waterSchemas.bodyValidation),
  updateWaterNote
);

export default waterNotesRouter;
