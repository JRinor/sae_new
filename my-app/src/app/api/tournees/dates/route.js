import { NextResponse } from 'next/server';
import db from '@/lib/db';

/**
 * @swagger
 * /api/tournees/dates:
 *   get:
 *     summary: Récupérer les dates de toutes les tournées
 *     responses:
 *       200:
 *         description: Liste des dates des tournées
 *       404:
 *         description: Aucune tournée trouvée
 *       500:
 *         description: Erreur serveur
 */
export async function GET() {
  try {
    const { rows } = await db.query('SELECT id_tournee, jour_preparation, jour_livraison FROM Tournee');

    if (rows.length === 0) {
      console.log('Aucune tournée trouvée dans la base de données.');
      return NextResponse.json({ error: 'Aucune tournée trouvée.' }, { status: 404 });
    }

    const tourneeDates = rows.map(row => ({
      id_tournee: row.id_tournee,
      jour_preparation: row.jour_preparation,
      jour_livraison: row.jour_livraison,
    }));

    return NextResponse.json(tourneeDates, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des dates de tournées :', error.message);
    return NextResponse.json({ error: `Erreur lors de la récupération des dates des tournées: ${error.message}` }, { status: 500 });
  }
}

export const runtime = 'nodejs';