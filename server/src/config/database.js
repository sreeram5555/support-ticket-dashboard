const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const dbPath = process.env.DB_PATH === ':memory:' 
  ? ':memory:' 
  : path.resolve(__dirname, '../../', process.env.DB_PATH || 'tickets.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
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
  );

  CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
  CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
  CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
  CREATE INDEX IF NOT EXISTS idx_tickets_title ON tickets(title COLLATE NOCASE);
  CREATE INDEX IF NOT EXISTS idx_tickets_email ON tickets(customer_email COLLATE NOCASE);
`);

module.exports = db;

// Auto-seed in production if empty
if (process.env.NODE_ENV === 'production') {
  const count = db.prepare('SELECT COUNT(*) as count FROM tickets').get().count;
  if (count === 0) {
    console.log('Production database is empty. Auto-seeding...');
    const { seed } = require('../../seed/seedData');
    seed(false); // seed without clearing
  }
}
