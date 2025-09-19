const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/routes/authRoutes');
const userService = require('../src/services/userService');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  const testUser = {
    name: "Test User JEST",
    username: "testuserJest",
    email: "testuserJEST@example.com",
    password: "secret123JEST"
  };

  let newUserId = null;

  afterEach(async () => {
    if (newUserId) {
      await userService.deleteUser(newUserId);
      newUserId = null;
    }
  });

  it('POST /auth/register should create a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(200);
    expect(res.body.isError).toBe(false);
    expect(res.body.message).toBe('Register Success.');
    expect(res.body.body).toHaveProperty('newUserId');
    expect(res.body.body.newUserId).toBeDefined();
    expect(res.body.body.newUserId).not.toBeNull();

    newUserId = res.body.body.newUserId;
  });

  it('POST /auth/login should login user', async () => {
    const createRes = await request(app).post('/auth/register').send(testUser);
    newUserId = createRes.body.body.newUserId;

    const res = await request(app)
      .post('/auth/login')
      .send({
        username: testUser.username,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('isError', false);
    expect(res.body).toHaveProperty('message', 'Login success');
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some(cookie => cookie.startsWith('accessToken='))).toBe(true);
    expect(cookies.some(cookie => cookie.startsWith('refreshToken='))).toBe(true);
  });

  it('GET /auth/profile should return user profile when authorized', async () => {
    const createRes = await request(app).post('/auth/register').send(testUser);
    newUserId = createRes.body.body.newUserId;

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ username: testUser.username, password: testUser.password });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('isError', false);
    expect(loginRes.body).toHaveProperty('message', 'Login success');

    const cookies = loginRes.headers['set-cookie'];

    const res = await request(app)
        .get('/auth/profile')
        .set('Cookie', cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.isError).toBe(false);
    expect(res.body.message).toBe('OK');
    expect(res.body.body).toHaveProperty('id', newUserId);
    expect(res.body.body).toHaveProperty('username', testUser.username);
  });

  it('should fail login with wrong credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: "wronguser",
        password: "wrongpass"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.isError).toBe(true);
    expect(res.body.message).toBeDefined();
  });
});
