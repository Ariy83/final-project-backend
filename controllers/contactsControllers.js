import {
  getContactsByFilter,
  getOneContactByFilter,
  removeContactByFilter,
  addContact,
  editContactByFilter,
  updateContactStatusByFilter,
  getContactsCountByFilter,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = limit * (page - 1);

  const { favorite } = req.query;

  if (favorite) {
    const total = await getContactsCountByFilter({ owner, favorite });
    const result = await getContactsByFilter(
      { owner, favorite },
      { skip, limit }
    );
    res.json({ total, result });
  } else {
    const total = await getContactsCountByFilter({ owner });
    const result = await getContactsByFilter({ owner }, { skip, limit });
    res.json({ total, result });
  }
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await getOneContactByFilter({ _id: id, owner });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await removeContactByFilter({ _id: id, owner });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await addContact({ ...req.body, owner });
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await editContactByFilter({ _id: id, owner }, req.body);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await updateContactStatusByFilter(
    { _id: contactId, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
