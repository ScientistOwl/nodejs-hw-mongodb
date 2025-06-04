const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, required: true, index: true },
    isFavourite: { type: Boolean, default: false },
    contactType: { type: String, enum: ['personal', 'home'], required: true },
  },
  { timestamps: true },
);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
