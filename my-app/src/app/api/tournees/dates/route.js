// src/app/api/tournees/dates/route.js
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await db.query('SELECT id_tournee, jour_preparation, jour_livraison FROM Tournee');

    if (rows.length === 0) {
      console.log('Aucune tournée trouvée dans la base de données.');  // Log de débogage
      return NextResponse.json({ error: 'Aucune tournée trouvée.' }, { status: 404 });
    }

    const tourneeDates = rows.map(row => ({
      id_tournee: row.id_tournee,
      jour_preparation: row.jour_preparation,
      jour_livraison: row.jour_livraison,
    }));

    return NextResponse.json(tourneeDates, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des dates de tournées :', error.message);  // Log d'erreur avec message spécifique
    return NextResponse.json({ error: `Erreur lors de la récupération des dates des tournées: ${error.message}` }, { status: 500 });
  }
}

export const runtime = 'nodejs'; // Assurez-vous que l'environnement Node.js est utilisé pour accéder à la base de données.
