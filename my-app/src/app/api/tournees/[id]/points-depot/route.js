import { NextResponse } from 'next/server';
import pool from '@/lib/db';

function extractTourneeId(pathname) {
  const segments = pathname.split('/');
  return segments[segments.length - 2];
}

export async function GET(req) {
  const id = extractTourneeId(req.nextUrl.pathname);

  if (!id || isNaN(id) || id <= 0) {
    return NextResponse.json({ error: 'ID de tournée invalide.' }, { status: 400 });
  }

  try {
    const { rows: points } = await pool.query(
      `
      SELECT pd.ID_PointDeDepot, pd.nom, pd.adresse, pd.latitude, pd.longitude
      FROM PointDeDepot pd
      INNER JOIN Tournee_PointDeDepot tpd ON pd.ID_PointDeDepot = tpd.ID_PointDeDepot
      WHERE tpd.ID_Tournee = $1
      ORDER BY tpd.numero_ordre
      `,
      [id]
    );

    if (points.length === 0) {
      return NextResponse.json({ error: 'Aucun point de dépôt trouvé pour cette tournée.' }, { status: 404 });
    }

    return NextResponse.json({ points }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function POST(req) {
  const id = extractTourneeId(req.nextUrl.pathname);
  const body = await req.json();
  const { pointId, ordre } = body;

  if (!id || isNaN(id) || id <= 0 || !pointId) {
    return NextResponse.json({ error: 'ID de tournée ou ID de point invalide.' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO Tournee_PointDeDepot (ID_Tournee, ID_PointDeDepot, numero_ordre, ID_Statut)
        VALUES ($1, $2, $3, 1)
        ON CONFLICT (ID_Tournee, ID_PointDeDepot) DO NOTHING;
      `;

      await client.query(query, [id, pointId, ordre || 0]);

      return NextResponse.json({ message: 'Point de dépôt ajouté à la tournée.' }, { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur. Veuillez réessayer plus tard.' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const tourneeId = extractTourneeId(req.nextUrl.pathname);
  const { pointId } = await req.json();

  if (!tourneeId || !pointId) {
    return NextResponse.json({ error: 'ID de tournée ou de point manquant.' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    try {
      await client.query(
        'DELETE FROM Tournee_PointDeDepot WHERE ID_Tournee = $1 AND ID_PointDeDepot = $2',
        [tourneeId, pointId]
      );
      return NextResponse.json({ message: 'Point retiré de la tournée.' }, { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function PATCH(req) {
  const tourneeId = extractTourneeId(req.nextUrl.pathname);
  const { pointId, newOrder } = await req.json();

  try {
    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE Tournee_PointDeDepot SET numero_ordre = $1 WHERE ID_Tournee = $2 AND ID_PointDeDepot = $3',
        [newOrder, tourneeId, pointId]
      );
      return NextResponse.json({ message: 'Ordre mis à jour.' }, { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export const runtime = 'nodejs';