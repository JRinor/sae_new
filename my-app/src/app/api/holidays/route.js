// src/app/api/holidays/route.js
import db from '@/lib/db';
import fetch from 'node-fetch';

/**
 * @swagger
 * /api/holidays:
 *   get:
 *     tags: [Calendrier]
 *     summary: Récupérer les jours fériés
 *     responses:
 *       200:
 *         description: Liste des jours fériés
 *       500:
 *         description: Erreur serveur
 */
export async function GET() {
  try {
    const response = await fetch('https://date.nager.at/api/v3/PublicHolidays/2025/FR');
    if (!response.ok) {
      console.error('Erreur lors de la récupération des jours fériés :', response.status, response.statusText);
      throw new Error('Erreur lors de la récupération des jours fériés');
    }
    const holidaysData = await response.json();
    const holidays = holidaysData.map(holiday => holiday.date);

    return new Response(JSON.stringify(holidays), { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des jours fériés :', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur.' }), { status: 500 });
  }
}
