import request from 'supertest';
import app from '../server';
import { User } from '../models/user.models';
import { generateToken } from '../utils/jwt';

describe('Users Routes', () => {
  let adminToken: string;

  beforeAll(async () => {
    await User.destroy({ where: {} });
    const admin = await User.create({ name: 'Admin', email: 'admin@test.com', password: '123456', rol: 'admin' });
    adminToken = generateToken({ id: admin.id, rol: 'admin' });
  });

  it('should get all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});
