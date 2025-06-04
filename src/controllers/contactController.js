const { validationResult } = require('express-validator');
const Contact = require('../models/contactModel');

const getContacts = async (req, res) => {
  try {
    const { name, contactType, isFavourite, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (name) filter.name = { $regex: new RegExp(name, 'i') };
    if (contactType) filter.contactType = contactType;
    if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

    const skip = (page - 1) * limit;
    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      totalContacts: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      contacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone, isFavourite, contactType } = req.body;
    const newContact = new Contact({
      name,
      email,
      phone,
      isFavourite,
      contactType,
    });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getContacts, createContact, updateContact, deleteContact };
