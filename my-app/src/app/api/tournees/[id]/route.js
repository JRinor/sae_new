import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req) {
  const id = req.nextUrl.pathname.split('/').pop();

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "L'ID de la tournée est invalide." }, { status: 400 });
  }

  try {
    const { rows } = await db.query('SELECT * FROM Tournee WHERE id_tournee = $1', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Tournée non trouvée.' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error during the GET request:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}


export async function PATCH(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { jour_preparation, jour_livraison, statut_tournee } = body;

  if (jour_preparation && jour_livraison && new Date(jour_preparation) >= new Date(jour_livraison)) {
    return NextResponse.json({
      error: 'La date de préparation doit être antérieure à la date de livraison.',
    }, { status: 400 });
  }

  if (!jour_preparation && !jour_livraison && !statut_tournee) {
    return NextResponse.json({ error: 'Aucune donnée à mettre à jour.' }, { status: 400 });
  }

  try {
    const query = `
      UPDATE Tournee
      SET jour_preparation = COALESCE($1, jour_preparation),
          jour_livraison = COALESCE($2, jour_livraison),
          statut_tournee = COALESCE($3, statut_tournee)
      WHERE id_tournee = $4 RETURNING *`;
    const { rows } = await db.query(query, [jour_preparation, jour_livraison, statut_tournee, id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Tournée non trouvée.' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error during the PATCH request:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { jour_preparation, jour_livraison, statut_tournee } = body;

  if (jour_preparation && jour_livraison && new Date(jour_preparation) >= new Date(jour_livraison)) {
    return NextResponse.json({
      error: 'La date de préparation doit être antérieure à la date de livraison.',
    }, { status: 400 });
  }

  if (!jour_preparation || !jour_livraison || !statut_tournee) {
    return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 });
  }

  try {
    const query = `
      UPDATE Tournee
      SET jour_preparation = $1, jour_livraison = $2, statut_tournee = $3
      WHERE id_tournee = $4 RETURNING *`;
    const { rows } = await db.query(query, [jour_preparation, jour_livraison, statut_tournee, id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Tournée non trouvée.' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error during the PUT request:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "L'ID de la tournée est invalide." }, { status: 400 });
  }

  try {
    const { rows } = await db.query('SELECT * FROM Tournee WHERE id_tournee = $1', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Tournée non trouvée.' }, { status: 404 });
    }

    await db.query('DELETE FROM Tournee WHERE id_tournee = $1', [id]);

    return NextResponse.json({ message: 'Tournée supprimée avec succès.' }, { status: 200 });
  } catch (error) {
    console.error('Error during the DELETE request:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function POST(req) {
  const body = await req.json();
  const { jour_preparation, jour_livraison, statut_tournee } = body;

  if (new Date(jour_preparation) >= new Date(jour_livraison)) {
    return NextResponse.json({
      error: 'La date de préparation doit être antérieure à la date de livraison.',
    }, { status: 400 });
  }

  if (!jour_preparation || !jour_livraison || !statut_tournee) {
    return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 });
  }

  try {
    const query = `
      INSERT INTO Tournee (jour_preparation, jour_livraison, statut_tournee)
      VALUES ($1, $2, $3) RETURNING *`;
    const { rows } = await db.query(query, [jour_preparation, jour_livraison, statut_tournee]);

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error during the POST request:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    { message: 'Méthodes autorisées : GET, POST, PATCH, PUT, DELETE' },
    { status: 200, headers: { 'Allow': 'GET, POST, PATCH, PUT, DELETE' } }
  );
}
