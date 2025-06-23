import Contact from '../models/Contact.js';
import createError from 'http-errors';

export const getAllContacts = async (owner, filters, options) => {
  const { skip, limit, sortOptions } = options;
  const contacts = await Contact.find({ owner, ...filters })
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);
  const totalItems = await Contact.countDocuments({ owner, ...filters });
  return { contacts, totalItems };
};

export const getContactById = async (contactId, owner) => {
  const contact = await Contact.findOne({ _id: contactId, owner });
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  return contact;
};

export const createContact = async (contactData, owner) => {
  const newContact = await Contact.create({ ...contactData, owner });
  return newContact;
};

export const updateContact = async (contactId, contactData, owner) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    contactData,
    { new: true },
  );
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }
  return updatedContact;
};

export const deleteContact = async (contactId, owner) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, owner });
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
};
