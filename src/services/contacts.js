import Contact from '../models/Contact.js';
import createError from 'http-errors';

export const getAllContacts = async (userId, filters, options) => {
  const { skip, limit, sortOptions } = options;
  const contacts = await Contact.find({ userId, ...filters })
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);
  const totalItems = await Contact.countDocuments({ userId, ...filters });
  return { contacts, totalItems };
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  return contact;
};

export const createContact = async (contactData, userId) => {
  const newContact = await Contact.create({ ...contactData, userId });
  return newContact;
};

export const updateContact = async (contactId, contactData, userId) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    contactData,
    { new: true },
  );
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }
  return updatedContact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
};
