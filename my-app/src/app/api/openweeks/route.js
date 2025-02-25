// src/app/api/openweeks/route.js
import db from '@/lib/db';

/**
 * @swagger
 * /api/openweeks:
 *   get:
 *     tags: [Calendrier]
 *     summary: Récupérer les semaines d'ouverture
 *     responses:
 *       200:
 *         description: Liste des semaines d'ouverture
 *       404:
 *         description: Aucune semaine d'ouverture trouvée
 *       500:
 *         description: Erreur serveur
 */

export async function GET() {
  try {
    const { rows } = await db.query("SELECT date FROM Calendrier WHERE type = 'ouverture'");
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Aucune semaine d\'ouverture trouvée.' }), { status: 404 });
    }

    const openWeeks = rows.map(row => row.date);
    return new Response(JSON.stringify(openWeeks), { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des semaines d\'ouverture :', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur.' }), { status: 500 });
  }
}
