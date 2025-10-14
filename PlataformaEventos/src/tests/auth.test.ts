import request from 'supertest';
import app from '../server';
import { User } from '../models/user.models';
import { hashPassword } from '../utils/password';

describe('Auth Routes', () => {

  beforeAll(async () => {
    await User.destroy({ where: {} });
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Juan', email: 'juan@test.com', password: '123456' });

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe('juan@test.com');
  });

  it('should login with correct credentials', async () => {
    const password = await hashPassword('123456');
    await User.create({ name: 'Pedro', email: 'pedro@test.com', password, rol: 'participante' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'pedro@test.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

});
