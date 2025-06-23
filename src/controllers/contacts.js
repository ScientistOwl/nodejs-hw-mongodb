import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
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

  const filters = {};
  if (isFavourite !== undefined) {
    filters.isFavourite = isFavourite === 'true';
  }
  if (contactType) {
    filters.contactType = contactType;
  }

  const { contacts, totalItems } = await getAllContacts(req.user.id, filters, {
    skip,
    limit,
    sortOptions,
  });

  const totalPages = Math.ceil(totalItems / limit);
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  res.status(200).json({
    status: 200,
    message: "All user's contacts returned successfully!",
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

const getById = async (req, res) => {
  const contact = await getContactById(req.params.contactId, req.user.id);
  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved contact!',
    data: contact,
  });
};

const create = async (req, res) => {
  const contact = await createContact(req.body, req.user.id);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

const update = async (req, res) => {
  const contact = await updateContact(
    req.params.contactId,
    req.body,
    req.user.id,
  );
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

const remove = async (req, res) => {
  await deleteContact(req.params.contactId, req.user.id);
  res.status(204).send();
};

export default {
  getContacts: ctrlWrapper(getContacts),
  getContactById: ctrlWrapper(getById),
  createContact: ctrlWrapper(create),
  updateContact: ctrlWrapper(update),
  deleteContact: ctrlWrapper(remove),
};
