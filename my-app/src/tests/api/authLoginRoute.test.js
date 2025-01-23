import { POST } from '@/app/api/auth/login/route';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('@/lib/db');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

global.Response = jest.fn((body, init) => ({
  json: () => Promise.resolve(JSON.parse(body)),
  status: init.status,
}));

describe('authLoginRoute', () => {
  test('should login a user', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        email: 'john.doe@example.com',
        mot_de_passe: 'password123'
      })
    };

    db.query.mockResolvedValue({ rows: [{ id_user: 1, email: 'john.doe@example.com', mot_de_passe: 'hashedPassword', id_role: 1 }] });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token');

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ token: 'token' });
  });

  test('should handle login errors', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        email: 'john.doe@example.com',
        mot_de_passe: 'password123'
      })
    };

    db.query.mockRejectedValue(new Error('Database error'));

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: 'Erreur lors de la connexion.' });
  });

  test('should handle incorrect email or password', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        email: 'john.doe@example.com',
        mot_de_passe: 'password123'
      })
    };

    db.query.mockResolvedValue({ rows: [] });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json).toEqual({ error: 'Email ou mot de passe incorrect.' });
  });
});