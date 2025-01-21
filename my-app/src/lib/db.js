// src/lib/db.js
import { Pool } from 'pg';

const pool = new Pool({
  user: 'user',
  host: 'db',  
  database: 'jardins_cocagne',
  password: 'mdpdefou',
  port: 5432,
});

// Connexion avec log
pool.on('connect', () => {
  console.log('Connexion à la base de données PostgreSQL réussie');
});

pool.on('error', (err, client) => {
  console.error('Erreur de connexion à la base de données PostgreSQL', err);
});

export default pool;
