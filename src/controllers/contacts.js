import Contact from '../models/Contact.js';
import createError from 'http-errors';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const getContacts = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    isFavourite,
    contactType,
  } = req.query;

  const currentPage = parseInt(page, 10);
  const limit = parseInt(perPage, 10);
  const skip = (currentPage - 1) * limit;

  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const sortOptions = { [sortBy]: sortDirection };

  const filter = {};
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }
  if (contactType) {
    filter.contactType = contactType;
  }

  const [contacts, totalItems] = await Promise.all([
    Contact.find(filter).sort(sortOptions).skip(skip).limit(limit),
    Contact.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / limit);
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page: currentPage,
      perPage: limit,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
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

  res.status(204).send();
};

export default {
  getContacts: ctrlWrapper(getContacts),
  getContactById: ctrlWrapper(getContactById),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
};
