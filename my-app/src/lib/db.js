import { Pool } from 'pg';

const pool = new Pool({
  user: 'user',
  host: 'db',
  database: 'mydatabase',
  password: 'password',
  port: 5432,
});

pool.on('connect', () => {
  console.log('Connexion à la base de données PostgreSQL réussie');
});

pool.on('error', (err, client) => {
  console.error('Erreur de connexion à la base de données PostgreSQL', err);
});

export default pool;
