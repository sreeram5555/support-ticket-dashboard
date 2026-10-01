const ticketService = require('../services/ticketService');

const createTicket = (req, res, next) => {
  try {
    const ticket = ticketService.createTicket(req.body);
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

const getTickets = (req, res, next) => {
  try {
    const result = ticketService.getTickets(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getTicketById = (req, res, next) => {
  try {
    const ticket = ticketService.getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Ticket not found',
          details: []
        }
      });
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

const updateTicket = (req, res, next) => {
  try {
    // First ensure it exists
    const ticket = ticketService.getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Ticket not found',
          details: []
        }
      });
    }

    const updatedTicket = ticketService.updateTicket(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedTicket });
  } catch (error) {
    next(error);
  }
};

const getStats = (req, res, next) => {
  try {
    const stats = ticketService.getStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

const deleteTicket = (req, res, next) => {
  try {
    const deleted = ticketService.deleteTicket(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: 404,
          message: 'Ticket not found',
          details: []
        }
      });
    }
    res.status(200).json({ success: true, data: { message: 'Ticket deleted successfully' } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  getStats,
  deleteTicket
};
