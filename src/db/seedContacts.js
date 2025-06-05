require('dotenv').config();
const mongoose = require('mongoose');
const Contact = require('../models/contactModel');

const contacts = [
  {
    name: 'Yulia Shevchenko',
    phone: '+380000000001',
    email: 'oleh1@example.com',
    isFavourite: false,
    contactType: 'personal',
  },
  {
    name: 'Dmytro Boyko',
    phone: '+380000000002',
    email: 'dmytro2@example.com',
    isFavourite: false,
    contactType: 'personal',
  },
  {
    name: 'Andriy Pavlenko',
    phone: '+380000000003',
    email: 'dmytro3@example.com',
    isFavourite: false,
    contactType: 'home',
  },
  {
    name: 'Yulia Shevchenko',
    phone: '+380000000004',
    email: 'yulia4@example.com',
    isFavourite: false,
    contactType: 'personal',
  },
  {
    name: 'Kateryna Povalenko',
    phone: '+380000000005',
    email: 'ivan5@example.com',
    isFavourite: false,
    contactType: 'personal',
  },
  {
    name: 'Anna Kovalenko',
    phone: '+380000000006',
    email: 'anna6@example.com',
    isFavourite: false,
    contactType: 'home',
  },
  {
    name: 'Oleh Tkachuk',
    phone: '+380000000007',
    email: 'andriy7@example.com',
    isFavourite: false,
    contactType: 'personal',
  },
  {
    name: 'Maria Petrenko',
    phone: '+380000000008',
    email: 'maria8@example.com',
    isFavourite: false,
    contactType: 'personal',
  },
  {
    name: 'Ivan Ivanenko',
    phone: '+380000000009',
    email: 'vasyl9@example.com',
    isFavourite: false,
    contactType: 'home',
  },
  {
    name: 'Kateryna Kovalchuk',
    phone: '+380000000010',
    email: 'kateryna10@example.com',
    isFavourite: false,
    contactType: 'personal',
  },
];

const seedContacts = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`,
    );

    console.log('Connected to MongoDB');

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
