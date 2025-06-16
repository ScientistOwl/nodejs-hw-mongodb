import express from 'express';
import contactsController from '../controllers/contacts.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import contactSchema from '../schemas/contactSchema.js';

const router = express.Router();

router.get('/', contactsController.getContacts);
router.get('/:contactId', isValidId, contactsController.getContactById);
router.post('/', validateBody(contactSchema), contactsController.createContact);
router.patch(
  '/:contactId',
  isValidId,
  validateBody(contactSchema),
  contactsController.updateContact,
);
router.delete('/:contactId', isValidId, contactsController.deleteContact);

export default router;
