const db = require('../config/database');

const createTicket = ({ title, description, customer_email, priority = 'Medium' }) => {
  const stmt = db.prepare(`
    INSERT INTO tickets (title, description, customer_email, priority)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(title, description, customer_email, priority);
  return getTicketById(info.lastInsertRowid);
};

const getTicketById = (id) => {
  const stmt = db.prepare('SELECT * FROM tickets WHERE id = ?');
  return stmt.get(id);
};

const updateTicket = (id, { status, priority }) => {
  const updates = [];
  const params = [];
  
  if (status) {
    updates.push('status = ?');
    params.push(status);
  }
  if (priority) {
    updates.push('priority = ?');
    params.push(priority);
  }
  
  if (updates.length === 0) return getTicketById(id);
  
  updates.push("updated_at = datetime('now')");
  params.push(id);
  
  const stmt = db.prepare(`
    UPDATE tickets 
    SET ${updates.join(', ')}
    WHERE id = ?
  `);
  stmt.run(...params);
  
  return getTicketById(id);
};

const getTickets = ({ search, status, priority, sortOrder = 'desc', page = 1, pageSize = 10 }) => {
  let query = 'SELECT * FROM tickets';
  let countQuery = 'SELECT COUNT(*) as count FROM tickets';
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push('(title LIKE ? OR customer_email LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  
  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }
  
  if (priority) {
    conditions.push('priority = ?');
    params.push(priority);
  }

  if (conditions.length > 0) {
    const whereClause = ' WHERE ' + conditions.join(' AND ');
    query += whereClause;
    countQuery += whereClause;
  }

  const direction = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  query += ` ORDER BY created_at ${direction}`;
  
  const offset = (page - 1) * pageSize;
  query += ' LIMIT ? OFFSET ?';
  const dataParams = [...params, pageSize, offset];

  const totalCount = db.prepare(countQuery).get(...params).count;
  const tickets = db.prepare(query).all(...dataParams);

  return {
    data: tickets,
    pagination: {
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize)
    }
  };
};

const getStats = () => {
  const stmt = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open,
      SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as inProgress,
      SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved
    FROM tickets
  `);
  const row = stmt.get();
  return {
    total: row.total || 0,
    open: row.open || 0,
    inProgress: row.inProgress || 0,
    resolved: row.resolved || 0
  };
};

const deleteTicket = (id) => {
  const stmt = db.prepare('DELETE FROM tickets WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
};

module.exports = {
  createTicket,
  getTicketById,
  updateTicket,
  getTickets,
  getStats,
  deleteTicket
};
