import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/authRoutes.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authLimiter, authRoutes);

describe('Auth Endpoints', () => {
  test('POST /api/auth/signup should reject short password', async () => {
    const userData = {
      email: 'test@example.com',
      password: '123'
    };

    const response = await request(app)
      .post('/api/auth/signup')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Password must be at least 6 characters');
  });

  test('POST /api/auth/login should reject missing credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Email and password are required');
  });

  test('POST /api/auth/signup should reject missing email', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Email and password are required');
  });
});