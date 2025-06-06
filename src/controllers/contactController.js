import Contact from '../models/contactModel.js';

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().lean();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.contactId).lean();

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact!`,
      data: contact,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getContacts, getContactById };
