import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, default: null },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['personal', 'work', 'other'],
      required: true,
    },
  },
  { timestamps: true },
);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
