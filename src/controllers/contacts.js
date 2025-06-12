import Contact from '../models/Contact.js';
import createError from 'http-errors';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const getContacts = async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved contacts!',
    data: contacts,
  });
};

const getContactById = async (req, res) => {
  const contact = await Contact.findById(req.params.contactId);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved contact!',
    data: contact,
  });
};

const createContact = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const newContact = await Contact.create({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

const updateContact = async (req, res) => {
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.contactId,
    req.body,
    { new: true },
  );
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

const deleteContact = async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.contactId);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully deleted contact!',
  });
};

export default {
  getContacts: ctrlWrapper(getContacts),
  getContactById: ctrlWrapper(getContactById),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
};
