const db = require('../config/database');

const createTicket = async ({ title, description, customer_email, priority = 'Medium' }) => {
  const stmt = db.prepare(`
    INSERT INTO tickets (title, description, customer_email, priority)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(title, description, customer_email, priority);
  return await getTicketById(info.lastInsertRowid);
};

const getTicketById = async (id) => {
  const stmt = db.prepare('SELECT * FROM tickets WHERE id = ?');
  return stmt.get(id);
};

const updateTicket = async (id, { status, priority, title, description }) => {
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
  if (title) {
    updates.push('title = ?');
    params.push(title);
  }
  if (description) {
    updates.push('description = ?');
    params.push(description);
  }
  
  if (updates.length === 0) return await getTicketById(id);
  
  updates.push("updated_at = datetime('now')");
  params.push(id);
  
  const stmt = db.prepare(`
    UPDATE tickets 
    SET ${updates.join(', ')}
    WHERE id = ?
  `);
  stmt.run(...params);
  
  return await getTicketById(id);
};

const getTickets = async ({ search, status, priority, sortOrder = 'desc', sortBy, page = 1, pageSize = 10 }) => {
  let query = 'SELECT * FROM tickets';
  let countQuery = 'SELECT COUNT(*) as count FROM tickets';
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push("(title LIKE ? ESCAPE '\\' OR customer_email LIKE ? ESCAPE '\\')");
    const escapedSearch = search.replace(/[\\%_]/g, '\\$&');
    params.push(`%${escapedSearch}%`, `%${escapedSearch}%`);
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

  let direction = 'DESC';
  if (sortOrder && sortOrder.toLowerCase() === 'asc') direction = 'ASC';
  if (sortBy === 'created_asc') direction = 'ASC';
  if (sortBy === 'created_desc') direction = 'DESC';
  
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

const getStats = async () => {
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

const deleteTicket = async (id) => {
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
