const request = require('supertest');
const app = require('../index');

describe('Authentication Tests', () => {
  describe('POST /api/login', () => {
    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test@demo.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@demo.com');
      expect(response.body.user.name).toBe('Test User');
      expect(typeof response.body.token).toBe('string');
    });

    test('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'wrong@demo.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test@demo.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should reject missing email', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Email and password are required');
    });

    test('should reject missing password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'test@demo.com'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Email and password are required');
    });

    test('should reject empty request body', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Email and password are required');
    });
  });
}); 