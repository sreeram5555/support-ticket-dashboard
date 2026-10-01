const seedData = [
  {
    title: 'Cannot login to my account',
    description: 'When I try to login with my email, it says invalid password but I am sure it is correct.',
    customer_email: 'user1@example.com',
    priority: 'High',
    status: 'Open'
  },
  {
    title: 'Billing statement not received',
    description: 'I did not receive the billing statement for the current month.',
    customer_email: 'finance@example.com',
    priority: 'Medium',
    status: 'In Progress'
  },
  {
    title: 'How to update profile picture?',
    description: 'I cannot find the option to update my profile picture in the settings menu.',
    customer_email: 'newbie@example.com',
    priority: 'Low',
    status: 'Resolved'
  },
  {
    title: 'App crashes on startup',
    description: 'The app crashes immediately after I tap the icon on my Android device.',
    customer_email: 'androiduser@example.com',
    priority: 'High',
    status: 'Open'
  },
  {
    title: 'Request for new feature',
    description: 'It would be great if we could export the dashboard data to PDF.',
    customer_email: 'manager@example.com',
    priority: 'Low',
    status: 'Open'
  }
];

const seed = async (clearFirst = true) => {
  console.log('Seeding database...');
  // Require dynamically to avoid circular dependency with config/database.js
  const { db, initDB } = require('../src/config/database');
  
  try {
    // Ensure table exists first if run standalone
    if (clearFirst) {
      await initDB();
    }

    const stmts = [];
    if (clearFirst) {
      stmts.push('DELETE FROM tickets');
      stmts.push("DELETE FROM sqlite_sequence WHERE name='tickets'");
    }

    for (const ticket of seedData) {
      stmts.push({
        sql: 'INSERT INTO tickets (title, description, customer_email, priority, status) VALUES (?, ?, ?, ?, ?)',
        args: [ticket.title, ticket.description, ticket.customer_email, ticket.priority, ticket.status]
      });
    }

    await db.batch(stmts, 'write');
    console.log('Database seeded successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

if (require.main === module) {
  seed().then(() => process.exit(0));
}

module.exports = { seedData, seed };
