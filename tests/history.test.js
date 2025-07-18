const request = require('supertest');
const app = require('../index');

describe('Search History Tests', () => {
  let authToken;

  beforeAll(async () => {
    // Get auth token for protected routes
    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        email: 'test@demo.com',
        password: 'password123'
      });
    authToken = loginResponse.body.token;
  });

  describe('GET /api/history', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/history');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Missing token');
    });

    test('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/history')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Invalid or expired token');
    });

    test('should return user search history', async () => {
      const response = await request(app)
        .get('/api/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('history');
      expect(Array.isArray(response.body.history)).toBe(true);
      
      // History should be sorted by timestamp descending
      if (response.body.history.length > 1) {
        const firstTimestamp = new Date(response.body.history[0].timestamp);
        const secondTimestamp = new Date(response.body.history[1].timestamp);
        expect(firstTimestamp.getTime()).toBeGreaterThanOrEqual(secondTimestamp.getTime());
      }
    });

    test('should limit history to 20 items', async () => {
      const response = await request(app)
        .get('/api/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.history.length).toBeLessThanOrEqual(20);
    });
  });

  describe('DELETE /api/history', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .delete('/api/history');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Missing token');
    });

    test('should reject invalid token', async () => {
      const response = await request(app)
        .delete('/api/history')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Invalid or expired token');
    });

    test('should clear user search history', async () => {
      const response = await request(app)
        .delete('/api/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Search history cleared');

      // Verify history is actually cleared
      const historyResponse = await request(app)
        .get('/api/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(historyResponse.status).toBe(200);
      expect(historyResponse.body.history).toEqual([]);
    });
  });
}); 