const request = require('supertest');
const app = require('../index');

describe('Admin Tests', () => {
  const ADMIN_JWT = process.env.ADMIN_JWT || 'adminsecret';

  describe('GET /api/admin/users', () => {
    test('should require admin authentication', async () => {
      const response = await request(app)
        .get('/api/admin/users');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Admin access denied');
    });

    test('should reject invalid admin token', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', 'Bearer invalid-admin-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Admin access denied');
    });

    test('should return all users and their history with valid admin token', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${ADMIN_JWT}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);

      // Check user structure
      if (response.body.users.length > 0) {
        const user = response.body.users[0];
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('history');
        expect(Array.isArray(user.history)).toBe(true);

        // Check history item structure
        if (user.history.length > 0) {
          const historyItem = user.history[0];
          expect(historyItem).toHaveProperty('query');
          expect(historyItem).toHaveProperty('timestamp');
          expect(typeof historyItem.query).toBe('string');
          expect(typeof historyItem.timestamp).toBe('string');
        }
      }
    });
  });
}); 