import Contact from '../models/Contact.js';
import createError from 'http-errors';

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  return contact;
};

export const createContact = async (contactData) => {
  const newContact = await Contact.create(contactData);
  return newContact;
};

export const updateContact = async (contactId, contactData) => {
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    contactData,
    { new: true },
  );
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }
  return updatedContact;
};

export const deleteContact = async (contactId) => {
  const contact = await Contact.findByIdAndDelete(contactId);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
};
