const ticketService = require('../services/ticketService');

const createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.createTicket(req.body);
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

const getTickets = async (req, res, next) => {
  try {
    const result = await ticketService.getTickets(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
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

const updateTicket = async (req, res, next) => {
  try {
    // First ensure it exists
    const ticket = await ticketService.getTicketById(req.params.id);
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

    const updatedTicket = await ticketService.updateTicket(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedTicket });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await ticketService.getStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

const deleteTicket = async (req, res, next) => {
  try {
    const deleted = await ticketService.deleteTicket(req.params.id);
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
