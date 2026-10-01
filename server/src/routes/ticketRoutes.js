const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const validators = require('../middleware/validators');

// Note: /stats must come before /:id so it's not captured by the :id param
router.get('/stats', ticketController.getStats);

router.get('/', validators.validateQueryParams, ticketController.getTickets);
router.post('/', validators.validateCreateTicket, ticketController.createTicket);

router.get('/:id', ticketController.getTicketById);
router.patch('/:id', validators.validateUpdateTicket, ticketController.updateTicket);

module.exports = router;
