import Contact from "../models/Contact.js";

export function listContacts() {
  return Contact.find({}, "-__v");
}

export function getContactsByFilter(filter, query = {}) {
  return Contact.find(filter, "-__v", query);
}

export function getContactsCountByFilter(filter) {
  return Contact.countDocuments(filter);
}

export function getContactById(id) {
  return Contact.findById(id, "-__v");
}

export function getOneContactByFilter(filter) {
  return Contact.findOne(filter, "-__v");
}

export function removeContact(id) {
  return Contact.findByIdAndDelete(id);
}

export function removeContactByFilter(filter) {
  return Contact.findOneAndDelete(filter);
}

export function addContact(data) {
  return Contact.create(data);
}

export function editContact(id, data) {
  return Contact.findByIdAndUpdate(id, data);
}

export function editContactByFilter(filter, data) {
  return Contact.findOneAndUpdate(filter, data);
}

export function updateContactStatus(id, body) {
  return Contact.findByIdAndUpdate(id, body);
}

export function updateContactStatusByFilter(filter, body) {
  return Contact.findByIdAndUpdate(filter, body);
}
