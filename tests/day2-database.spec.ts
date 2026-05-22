import { test, expect } from './fixtures/db.fixture';

test.describe('Database Testing — Users', () => {

  test('should retrieve all users from database', async ({ db }) => {
    const result = await db.query('SELECT * FROM users');

    // Assert at least 3 users exist
    expect(result.rows.length).toBeGreaterThanOrEqual(3);

    // Assert correct columns exist
    expect(result.rows[0]).toHaveProperty('id');
    expect(result.rows[0]).toHaveProperty('email');
    expect(result.rows[0]).toHaveProperty('username');
    expect(result.rows[0]).toHaveProperty('role');
    expect(result.rows[0]).toHaveProperty('password_hash');
    expect(result.rows[0]).toHaveProperty('created_at');
  });

  test('should find admin user with correct role', async ({ db }) => {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      ['admin@example.com']
    );

    // Assert user exists
    expect(result.rows.length).toBe(1);

    // Assert correct role
    expect(result.rows[0].role).toBe('admin');
    expect(result.rows[0].username).toBe('admin');
  });

  test('password hash should never be stored in plain text', async ({ db }) => {
    const result = await db.query('SELECT password_hash FROM users');

    // Assert every user has a bcrypt hash
    for (const row of result.rows) {
      expect(row.password_hash).toMatch(/^\$2b\$/);
    }
  });

  test('should insert new user and verify with ROLLBACK', async ({ db }) => {
    // Insert new user
    await db.query(
      `INSERT INTO users (email, username, role, password_hash)
       VALUES ($1, $2, $3, $4)`,
      ['newuser@example.com', 'newuser', 'user', '$2b$10$newhash']
    );

    // Verify user was inserted
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      ['newuser@example.com']
    );
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].username).toBe('newuser');

    // Note: ROLLBACK happens automatically in fixture after this test
    // So this user will NOT persist in the database after test completes
  });

});