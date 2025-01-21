// src/lib/db.js
import { Pool } from 'pg';

// Création d'une nouvelle instance de Pool pour la connexion à la base de données
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

// Gestion des erreurs de connexion
pool.on('error', (err, client) => {
  console.error('Erreur de connexion à la base de données PostgreSQL', err);
});

// Exportation par défaut de l'instance pool
export default pool;
