const db = require('../src/config/database');

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

const seed = (clearFirst = true) => {
  console.log('Seeding database...');
  
  const stmt = db.prepare(`
    INSERT INTO tickets (title, description, customer_email, priority, status)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((tickets) => {
    for (const ticket of tickets) {
      stmt.run(ticket.title, ticket.description, ticket.customer_email, ticket.priority, ticket.status);
    }
  });

  try {
    if (clearFirst) {
      // Clear existing data
      db.prepare('DELETE FROM tickets').run();
      db.prepare("DELETE FROM sqlite_sequence WHERE name='tickets'").run();
    }

    insertMany(seedData);
    console.log('Database seeded successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

if (require.main === module) {
  seed();
}

module.exports = { seedData, seed };
