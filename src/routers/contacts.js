import express from 'express';
import contactsController from '../controllers/contacts.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';
import {
  contactSchema,
  updateContactSchema,
} from '../schemas/contactSchema.js';

const router = express.Router();

router.use(authenticate);

router.get('/', contactsController.getContacts);
router.get('/:contactId', isValidId, contactsController.getContactById);

router.post(
  '/',
  upload.single('photo'),
  validateBody(contactSchema),
  contactsController.createContact,
);

router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  contactsController.updateContact,
);

router.delete('/:contactId', isValidId, contactsController.deleteContact);

export default router;
