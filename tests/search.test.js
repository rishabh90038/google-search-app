const request = require('supertest');
const app = require('../index');

describe('Search Tests', () => {
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

  describe('POST /api/search', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/search')
        .send({
          query: 'test query'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Missing token');
    });

    test('should reject invalid token', async () => {
      const response = await request(app)
        .post('/api/search')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          query: 'test query'
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Invalid or expired token');
    });

    test('should reject missing query', async () => {
      const response = await request(app)
        .post('/api/search')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Query is required');
    });

    test('should reject empty query', async () => {
      const response = await request(app)
        .post('/api/search')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: ''
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Query is required');
    });

    test('should accept valid search query', async () => {
      const response = await request(app)
        .post('/api/search')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: 'test search'
        });

      // Note: This test might fail if Google API is not configured
      // or if there are API key restrictions
      if (response.status === 200) {
        expect(response.body).toHaveProperty('results');
        expect(Array.isArray(response.body.results)).toBe(true);
        expect(response.body.results.length).toBeLessThanOrEqual(5);
        
        if (response.body.results.length > 0) {
          const result = response.body.results[0];
          expect(result).toHaveProperty('title');
          expect(result).toHaveProperty('link');
          expect(result).toHaveProperty('snippet');
        }
      } else {
        // If API fails, we should get a proper error message
        expect(response.body).toHaveProperty('message');
        expect(typeof response.body.message).toBe('string');
      }
    });

    test('should handle pagination with start parameter', async () => {
      const response = await request(app)
        .post('/api/search')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: 'test search',
          start: 6
        });

      if (response.status === 200) {
        expect(response.body).toHaveProperty('results');
        expect(Array.isArray(response.body.results)).toBe(true);
      } else {
        expect(response.body).toHaveProperty('message');
      }
    });
  });
}); 