const { createClient } = require('@libsql/client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

let url = process.env.DATABASE_URL || 'file:tickets.db';

// Force an isolated in-memory db for tests, completely ignoring any env vars
if (process.env.NODE_ENV === 'test') {
  url = 'file::memory:';
}

const isRemote = url.startsWith('libsql://') || url.startsWith('https://');

if (isRemote && !process.env.DATABASE_AUTH_TOKEN && process.env.NODE_ENV !== 'test') {
  console.error('ERROR: DATABASE_URL is a remote libsql:// URL, but DATABASE_AUTH_TOKEN is missing. Please set it in your environment variables.');
  process.exit(1);
}

const db = createClient({
  url,
  authToken: isRemote ? process.env.DATABASE_AUTH_TOKEN : undefined
});

const initDB = async () => {
  await db.batch([
    `CREATE TABLE IF NOT EXISTS tickets (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      title          TEXT    NOT NULL CHECK(length(title) <= 120),
      description    TEXT    NOT NULL,
      customer_email TEXT    NOT NULL,
      priority       TEXT    NOT NULL DEFAULT 'Medium'
                             CHECK(priority IN ('Low', 'Medium', 'High')),
      status         TEXT    NOT NULL DEFAULT 'Open'
                             CHECK(status IN ('Open', 'In Progress', 'Resolved')),
      created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at     TEXT    NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status)`,
    `CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority)`,
    `CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_tickets_title ON tickets(title COLLATE NOCASE)`,
    `CREATE INDEX IF NOT EXISTS idx_tickets_email ON tickets(customer_email COLLATE NOCASE)`
  ], 'write');

  // Auto-seed in production if empty
  if (process.env.NODE_ENV === 'production') {
    const rs = await db.execute('SELECT COUNT(*) as count FROM tickets');
    const count = Number(rs.rows[0].count);
    if (count === 0) {
      console.log('Production database is empty. Auto-seeding...');
      const { seed } = require('../../seed/seedData');
      await seed(false); // seed without clearing
    }
  }
};

module.exports = { db, initDB };
