import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * @swagger
 * /api/tournees:
 *   get:
 *     summary: Récupérer toutes les tournées
 *     responses:
 *       200:
 *         description: Liste des tournées
 *       500:
 *         description: Erreur serveur
 */
export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const { rows } = await client.query('SELECT id_tournee, jour_preparation, jour_livraison FROM Tournee');
      
      // Retourner un tableau vide au lieu d'une erreur s'il n'y a pas de tournées
      if (rows.length === 0) {
        return NextResponse.json([], { status: 200 });
      }

      const tourneeDates = rows.map(row => ({
        id_tournee: row.id_tournee,
        jour_preparation: row.jour_preparation,
        jour_livraison: row.jour_livraison,
      }));

      return NextResponse.json(tourneeDates, { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des dates de tournées :', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/tournees:
 *   post:
 *     summary: Créer une nouvelle tournée
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jour_preparation:
 *                 type: string
 *                 format: date
 *               jour_livraison:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Tournée créée
 *       400:
 *         description: Champs requis manquants ou invalides
 *       500:
 *         description: Erreur serveur
 */
export async function POST(req) {
  const { jour_preparation, jour_livraison } = await req.json();

  if (!jour_preparation || !jour_livraison) {
    return NextResponse.json({ error: 'Les champs jour_preparation et jour_livraison sont requis.' }, { status: 400 });
  }

  if (new Date(jour_preparation) >= new Date(jour_livraison)) {
    return NextResponse.json({
      error: 'La date de préparation doit être antérieure à la date de livraison.',
    }, { status: 400 });
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO Tournee (jour_preparation, jour_livraison) VALUES ($1, $2) RETURNING *',
      [jour_preparation, jour_livraison]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la tournée :', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export const runtime = 'nodejs'; // Assurez-vous que l'environnement Node.js est utilisé pour accéder à la base de données.