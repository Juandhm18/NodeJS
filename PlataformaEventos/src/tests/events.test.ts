import request from 'supertest';
import app from '../server';
import { User } from '../models/user.models';
import { Event } from '../models/event.model';
import { generateToken } from '../utils/jwt';

describe('Events Routes', () => {
  let organizerToken: string;

  beforeAll(async () => {
    await User.destroy({ where: {} });
    await Event.destroy({ where: {} });

    const organizer = await User.create({ name: 'Org', email: 'org@test.com', password: '123456', rol: 'organizador' });
    organizerToken = generateToken({ id: organizer.id, rol: 'organizador' });
  });

  it('should create a new event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({ title: 'Evento Test', description: 'Desc', date: new Date(), place: 'Medellín', capacity: 50 });

    expect(res.status).toBe(201);
    expect(res.body.evento).toHaveProperty('id');
  });

});
