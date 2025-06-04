const express = require('express');
const { body } = require('express-validator');
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');

const router = express.Router();

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts with optional filters and pagination
 *     parameters:
 *       - name: name
 *         in: query
 *         schema:
 *           type: string
 *       - name: contactType
 *         in: query
 *         schema:
 *           type: string
 *           enum: [personal, home]
 *       - name: isFavourite
 *         in: query
 *         schema:
 *           type: boolean
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of contacts
 */
router.get('/', getContacts);

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               contactType:
 *                 type: string
 *                 enum: [personal, home]
 *               isFavourite:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Contact created successfully
 */
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('contactType')
      .isIn(['personal', 'home'])
      .withMessage('Invalid contact type'),
  ],
  createContact,
);

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update an existing contact
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               contactType:
 *                 type: string
 *                 enum: [personal, home]
 *               isFavourite:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       404:
 *         description: Contact not found
 */
router.put('/:id', updateContact);

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 */
router.delete('/:id', deleteContact);

module.exports = router;
