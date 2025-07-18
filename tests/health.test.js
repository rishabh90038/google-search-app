const request = require('supertest');
const app = require('../index');

describe('Health and General API Tests', () => {
  describe('GET /api/health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.status).toBe('OK');
      expect(typeof response.body.timestamp).toBe('string');
    });
  });

  describe('Rate Limiting', () => {
    test('should limit login attempts', async () => {
      const requests = Array(25).fill().map(() => 
        request(app)
          .post('/api/login')
          .send({
            email: 'test@demo.com',
            password: 'wrongpassword'
          })
      );

      const responses = await Promise.all(requests);
      const tooManyRequests = responses.filter(r => r.status === 429);
      
      // Should have rate limiting after 20 requests
      expect(tooManyRequests.length).toBeGreaterThan(0);
    });

    test('should limit search requests', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          email: 'test@demo.com',
          password: 'password123'
        });
      
      const authToken = loginResponse.body.token;

      const requests = Array(25).fill().map(() => 
        request(app)
          .post('/api/search')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            query: 'test query'
          })
      );

      const responses = await Promise.all(requests);
      const tooManyRequests = responses.filter(r => r.status === 429);
      
      // Should have rate limiting after 20 requests
      expect(tooManyRequests.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent');

      expect(response.status).toBe(404);
    });

    test('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}');

      expect(response.status).toBe(400);
    });
  });
}); 