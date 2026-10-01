const { db } = require('../config/database');

const createTicket = async ({ title, description, customer_email, priority = 'Medium' }) => {
  const rs = await db.execute({
    sql: 'INSERT INTO tickets (title, description, customer_email, priority) VALUES (?, ?, ?, ?)',
    args: [title, description, customer_email, priority]
  });
  return await getTicketById(Number(rs.lastInsertRowid));
};

const getTicketById = async (id) => {
  const rs = await db.execute({
    sql: 'SELECT * FROM tickets WHERE id = ?',
    args: [id]
  });
  return rs.rows[0];
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
  
  await db.execute({
    sql: `UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`,
    args: params
  });
  
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
  
  query += ` ORDER BY created_at ${direction}, id ${direction}`;
  
  const offset = (page - 1) * pageSize;
  query += ' LIMIT ? OFFSET ?';
  const dataParams = [...params, pageSize, offset];

  const totalCountRs = await db.execute({ sql: countQuery, args: params });
  const totalCount = Number(totalCountRs.rows[0].count);
  
  const ticketsRs = await db.execute({ sql: query, args: dataParams });

  return {
    data: ticketsRs.rows,
    pagination: {
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize)
    }
  };
};

const getStats = async () => {
  const rs = await db.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open,
      SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as inProgress,
      SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved
    FROM tickets
  `);
  const row = rs.rows[0];
  return {
    total: Number(row.total) || 0,
    open: Number(row.open) || 0,
    inProgress: Number(row.inProgress) || 0,
    resolved: Number(row.resolved) || 0
  };
};

const deleteTicket = async (id) => {
  const rs = await db.execute({
    sql: 'DELETE FROM tickets WHERE id = ?',
    args: [id]
  });
  return rs.rowsAffected > 0;
};

module.exports = {
  createTicket,
  getTicketById,
  updateTicket,
  getTickets,
  getStats,
  deleteTicket
};
