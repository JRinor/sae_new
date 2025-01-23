import pool from '@/lib/db';

jest.mock('pg', () => {
  const mockPool = {
    on: jest.fn(),
    query: jest.fn(),
    connect: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

describe('Database Connection', () => {
  test('should configure database with correct options', () => {
    expect(pool).toBeDefined();
    expect(pool.on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(pool.on).toHaveBeenCalledWith('error', expect.any(Function));
  });

  test('should handle successful connection', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const connectHandler = pool.on.mock.calls.find(call => call[0] === 'connect')[1];
    
    connectHandler();
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Connexion à la base de données PostgreSQL réussie'
    );
    consoleSpy.mockRestore();
  });

  test('should handle connection error', async () => {
    const consoleSpy = jest.spyOn(console, 'error');
    const errorHandler = pool.on.mock.calls.find(call => call[0] === 'error')[1];
    const mockError = new Error('Connection failed');
    
    errorHandler(mockError);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Erreur de connexion à la base de données PostgreSQL',
      mockError
    );
    consoleSpy.mockRestore();
  });

  test('should use correct environment variables', () => {
    const { Pool } = require('pg');
    expect(Pool).toHaveBeenCalledWith({
      user: 'postgres',
      host: expect.any(String),
      database: 'jardins_cocagne',
      password: 'mdp123456',
      port: 5432,
    });
  });

  test('placeholder test', () => {
    expect(true).toBe(true);
  });
});
