const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

// Note: DB_PATH=:memory: should be set when running tests.

beforeAll(() => {
  // Ensure table is clean before tests
  db.prepare('DELETE FROM tickets').run();
  db.prepare("DELETE FROM sqlite_sequence WHERE name='tickets'").run();
});

afterAll(() => {
  // Close the DB connection
  db.close();
});

describe('Ticket API Endpoints', () => {
  let createdTicketId;

  it('should create a new ticket', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .send({
        title: 'Test Ticket',
        description: 'This is a test ticket',
        customer_email: 'test@example.com',
        priority: 'High'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.title).toBe('Test Ticket');
    createdTicketId = res.body.data.id;
  });

  it('should validate ticket creation input', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .send({
        title: '', // Empty title
        description: 'Test',
        customer_email: 'not-an-email',
      });

    expect(res.statusCode).toEqual(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.details.length).toBeGreaterThan(0);
  });

  it('should get a list of tickets with pagination', async () => {
    const res = await request(app).get('/api/tickets?page=1&pageSize=10');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination.totalCount).toBeGreaterThan(0);
  });

  it('should get ticket stats', async () => {
    const res = await request(app).get('/api/tickets/stats');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('total');
    expect(res.body.data).toHaveProperty('open');
  });

  it('should get a ticket by ID', async () => {
    const res = await request(app).get(`/api/tickets/${createdTicketId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toEqual(createdTicketId);
  });

  it('should update a ticket status', async () => {
    const res = await request(app)
      .patch(`/api/tickets/${createdTicketId}`)
      .send({
        status: 'In Progress'
      });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('In Progress');
  });

  it('should return 404 for a non-existent ticket update', async () => {
    const res = await request(app)
      .patch('/api/tickets/999999')
      .send({
        status: 'Resolved'
      });
      
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
  });
});
