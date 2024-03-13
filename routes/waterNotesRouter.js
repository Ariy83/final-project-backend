import express from "express";
import waterNotesControllers from "../controllers/waterNotesControllers.js";
import validateBody from "../decorators/validateBody.js";
import waterNotesSchemas from "../schemas/waterNotesSchemas.js";
import isValidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";

const waterNotesRouter = express.Router();

waterNotesRouter.use(authenticate);

waterNotesRouter.get("/", waterNotesControllers.getAllWaterNotes);

waterNotesRouter.get(
  "/:id",
  isValidId.forId,
  waterNotesControllers.getOneWaterNote
);

waterNotesRouter.delete(
  "/:id",
  isValidId.forId,
  waterNotesControllers.deleteWaterNote
);

waterNotesRouter.post(
  "/",
  validateBody(waterNotesSchemas.createWaterNotesSchema),
  waterNotesControllers.createWaterNote
);

waterNotesRouter.put(
  "/:id",
  isValidId.forId,
  validateBody(waterNotesSchemas.updateWaterNotesSchema),
  waterNotesControllers.updateWaterNote
);

export default waterNotesRouter;
