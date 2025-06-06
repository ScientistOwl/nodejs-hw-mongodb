import mongoose from 'mongoose';
import Contact from '../models/contactModel.js';
import fs from 'fs';

const seedContacts = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`,
    );
    console.log('Connected to MongoDB');

    const contacts = JSON.parse(
      fs.readFileSync('./src/db/contacts.json', 'utf8'),
    );

    await Contact.deleteMany();
    console.log('Database cleaned!');

    const insertedContacts = await Contact.insertMany(contacts);
    console.log(`Successfully inserted ${insertedContacts.length} contacts`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding contacts:', error);
    process.exit(1);
  }
};

seedContacts();
