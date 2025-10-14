import request from 'supertest';
import app from '../server';
import { User } from '../models/user.models';
import { Event } from '../models/event.model';
import { Inscription } from '../models/inscription.model';
import { generateToken } from '../utils/jwt';

describe('Inscriptions Routes', () => {
  let userToken: string;
  let eventId: number;

  beforeAll(async () => {
    await User.destroy({ where: {} });
    await Event.destroy({ where: {} });
    await Inscription.destroy({ where: {} });

    const user = await User.create({ name: 'User', email: 'user@test.com', password: '123456', rol: 'participante' });
    userToken = generateToken({ id: user.id, rol: 'participante' });

    const organizer = await User.create({ name: 'Org', email: 'org@test.com', password: '123456', rol: 'organizador' });
    const event = await Event.create({ title: 'Evento', description: 'Desc', date: new Date(), place: 'Medellín', capacity: 10, organizerId: organizer.id });
    eventId = event.id;
  });

  it('should create an inscription', async () => {
    const res = await request(app)
      .post('/api/inscriptions')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ eventId });

    expect(res.status).toBe(201);
    expect(res.body.inscription).toHaveProperty('id');
  });

});
