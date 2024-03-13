// import express from "express";
// import contactsControllers from "../controllers/contactsControllers.js";
// import validateBody from "../decorators/validateBody.js";
// import {
//   createContactSchema,
//   updateContactSchema,
//   updateFavContactSchema,
// } from "../schemas/contactsSchemas.js";
// import isValidId from "../middlewares/isValidId.js";
// import authenticate from "../middlewares/authenticate.js";

// const contactsRouter = express.Router();

// contactsRouter.use(authenticate);

// contactsRouter.get("/", contactsControllers.getAllContacts);

// contactsRouter.get("/:id", isValidId.forId, contactsControllers.getOneContact);

// contactsRouter.delete(
//   "/:id",
//   isValidId.forId,
//   contactsControllers.deleteContact
// );

// contactsRouter.post(
//   "/",
//   validateBody(createContactSchema),
//   contactsControllers.createContact
// );

// contactsRouter.put(
//   "/:id",
//   isValidId.forId,
//   validateBody(updateContactSchema),
//   contactsControllers.updateContact
// );

// contactsRouter.patch(
//   "/:contactId/favorite",
//   isValidId.forContactId,
//   validateBody(updateFavContactSchema),
//   contactsControllers.updateStatusContact
// );

// export default contactsRouter;
