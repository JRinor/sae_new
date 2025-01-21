// src/app/api/tournees/[id]/route.js
import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Importation correcte de db avec export par défaut

// Récupérer une tournée par ID (GET)
export async function GET(req, { params }) {
  const { id } = await params; // Attendre la résolution de params

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

// Mettre à jour une tournée partiellement (PATCH)
export async function PATCH(req, { params }) {
  const { id } = await params; // Attendre la résolution de params
  const body = await req.json();
  const { jour_preparation, jour_livraison, statut_tournee } = body;

  // Validation des données entrantes
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

// Mettre à jour une tournée entièrement (PUT)
export async function PUT(req, { params }) {
  const { id } = await params; // Attendre la résolution de params
  const body = await req.json();
  const { jour_preparation, jour_livraison, statut_tournee } = body;

  // Validation des données entrantes
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

// Supprimer une tournée (DELETE)
export async function DELETE(req, { params }) {
  const { id } = await params; // Attendre la résolution de params

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "L'ID de la tournée est invalide." }, { status: 400 });
  }

  try {
    const { rowCount } = await db.query('DELETE FROM Tournee WHERE id_tournee = $1', [id]);

    if (rowCount === 0) {
      return NextResponse.json({ error: 'Tournée non trouvée.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Tournée supprimée avec succès.' }, { status: 200 });
  } catch (error) {
    console.error('Error during the DELETE request:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

// Ajouter une nouvelle tournée (POST)
export async function POST(req) {
  const body = await req.json();
  const { jour_preparation, jour_livraison, statut_tournee } = body;

  // Validation des données entrantes
  if (!jour_preparation || !jour_livraison || !statut_tournee) {
    return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 });
  }

  try {
    const query = `
      INSERT INTO Tournee (jour_preparation, jour_livraison, statut_tournee)
      VALUES ($1, $2, $3) RETURNING *`;
    const { rows } = await db.query(query, [jour_preparation, jour_livraison, statut_tournee]);

    return NextResponse.json(rows[0], { status: 201 }); // Retourne la tournée ajoutée
  } catch (error) {
    console.error('Error during the POST request:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

// Vérification des méthodes autorisées (OPTIONS)
export async function OPTIONS() {
  return NextResponse.json(
    { message: 'Méthodes autorisées : GET, POST, PATCH, PUT, DELETE' },
    { status: 200, headers: { 'Allow': 'GET, POST, PATCH, PUT, DELETE' } }
  );
}
