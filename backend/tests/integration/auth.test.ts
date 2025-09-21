import request from 'supertest';
import express from 'express';
import authRoutes from '../../src/routes/auth';
import './setup';
import { clearDatabase } from './setup';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON' });
  }
  res.status(500).json({ error: err.message });
});

describe('Auth Integration Tests', () => {
  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const username = 'loginuser1';

      // Register user
      await request(app)
        .post('/api/auth/register')
        .send({ username, password: 'password123' });

      // Login
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username, password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.username).toBe(username);
      expect(response.body.data.user.role).toBe('user');
      expect(response.body.data).toHaveProperty('token');
    });

    it('should fail with invalid credentials', async () => {
      const username = 'loginuser2';
      await request(app).post('/api/auth/register').send({ username, password: 'password123' });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username, password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid username or password');
    });

    it('should fail with missing username', async () => {
      const response = await request(app).post('/api/auth/login').send({ password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password required');
    });

    it('should fail with missing password', async () => {
      const response = await request(app).post('/api/auth/login').send({ username: 'user' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password required');
    });

    it('should fail with non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nonexistent', password: 'password123' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid username or password');
    });

    it('should login admin user successfully', async () => {
      const username = 'adminlogin';
      await request(app)
        .post('/api/auth/create-admin')
        .send({ username, password: 'admin123' });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username, password: 'admin123' });

      expect(response.status).toBe(200);
      expect(response.body.data.user.role).toBe('admin');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register new user successfully', async () => {
      const username = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username, password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.username).toBe(username);
      expect(response.body.data.user.role).toBe('user');
      expect(response.body.data).toHaveProperty('token');
    });

    it('should fail with duplicate username', async () => {
      const username = 'duplicateuser';
      await request(app).post('/api/auth/register').send({ username, password: 'password123' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({ username, password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Username already exists');
    });

    it('should fail with password too short', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'shortpass', password: '123' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Password must be at least 6 characters long');
    });

    it('should fail with missing username', async () => {
      const response = await request(app).post('/api/auth/register').send({ password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password required');
    });

    it('should fail with missing password', async () => {
      const response = await request(app).post('/api/auth/register').send({ username: 'nopassuser' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password required');
    });

    it('should handle underscores in username', async () => {
      const username = `user_with_underscores_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username, password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body.data.user.username).toBe(username);
    });

    it('should register users with role "user" by default', async () => {
      const username = `defaultroleuser_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username, password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body.data.user.role).toBe('user');
    });
  });

  describe('POST /api/auth/create-admin', () => {
    it('should create admin user successfully', async () => {
      const username = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const response = await request(app)
        .post('/api/auth/create-admin')
        .send({ username, password: 'admin123' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Admin user created successfully');
    });

    it('should fail with missing username', async () => {
      const response = await request(app).post('/api/auth/create-admin').send({ password: 'admin123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password required');
    });

    it('should fail with missing password', async () => {
      const response = await request(app).post('/api/auth/create-admin').send({ username: 'admin' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password required');
    });
  });

  describe('Error handling', () => {
    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send('invalid json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Malformed JSON');
    });

    it('should handle empty request body', async () => {
      const response = await request(app).post('/api/auth/login').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password required');
    });

    it('should handle null values', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: null, password: null });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password required');
    });

    it('should handle empty strings', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: '', password: '' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password required');
    });
  });

  describe('Content-Type handling', () => {
    it('should accept application/json content type', async () => {
      const username = 'contenttypeuser';
      await request(app).post('/api/auth/register').send({ username, password: 'password123' });

      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ username, password: 'password123' }));

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should handle missing content-type header', async () => {
      const username = 'nocontenttype';
      await request(app).post('/api/auth/register').send({ username, password: 'password123' });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username, password: 'password123' });

      expect(response.status).toBe(200);
    });
  });
});
