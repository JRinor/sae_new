// src/app/api/tournees/[id]/route.js
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req, { params }) {
  const { id } = params;

  console.log(`GET request received for tour with ID: ${id}`);

  if (!id || isNaN(id)) {
    console.error('Invalid or missing tour ID.');
    return NextResponse.json(
      { error: "L'ID de la tournée est invalide ou manquant." },
      { status: 400 }
    );
  }

  try {
    console.log('Preparing to fetch the tour from the database...');
    const { rows } = await db.query('SELECT * FROM Tournee WHERE id_tournee = $1', [id]);

    console.log(`Number of rows returned: ${rows.length}`);

    if (rows.length === 0) {
      console.warn(`Tour with ID ${id} not found.`);
      return NextResponse.json({ error: 'Tournée non trouvée.' }, { status: 404 });
    }

    console.log(`Tour with ID ${id} found:`, rows[0]);
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error during the tour retrieval:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const { id } = params;

  console.log(`PATCH request received for tour with ID: ${id}`);

  if (!id || isNaN(id)) {
    console.error('Invalid or missing tour ID.');
    return NextResponse.json(
      { error: "L'ID de la tournée est invalide ou manquant." },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { jour_preparation, jour_livraison, statut_tournee } = body;

  if (!jour_preparation && !jour_livraison && !statut_tournee) {
    console.error('No valid field provided for update.');
    return NextResponse.json(
      {
        error:
          'Au moins un champ (jour_preparation, jour_livraison, statut_tournee) doit être fourni.',
      },
      { status: 400 }
    );
  }

  try {
    console.log('Preparing to update the tour...');
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (jour_preparation) {
      updates.push(`jour_preparation = $${paramIndex++}`);
      params.push(jour_preparation);
    }

    if (jour_livraison) {
      updates.push(`jour_livraison = $${paramIndex++}`);
      params.push(jour_livraison);
    }

    if (statut_tournee) {
      updates.push(`statut_tournee = $${paramIndex++}`);
      params.push(statut_tournee);
    }

    params.push(id); // ID de la tournée
    const query = `UPDATE Tournee SET ${updates.join(', ')} WHERE id_tournee = $${paramIndex} RETURNING *`;

    console.log(`Executing query: ${query}`);
    const { rows } = await db.query(query, params);

    console.log(`Number of rows returned: ${rows.length}`);

    if (rows.length === 0) {
      console.warn(`Tour with ID ${id} not found or update failed.`);
      return NextResponse.json({ error: 'Tournée non trouvée ou mise à jour échouée.' }, { status: 404 });
    }

    console.log(`Tour with ID ${id} successfully updated:`, rows[0]);
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error during the tour update:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  console.log(`DELETE request received for tour with ID: ${id}`);

  if (!id || isNaN(id)) {
    console.error('Invalid or missing tour ID.');
    return NextResponse.json(
      { error: "L'ID de la tournée est invalide ou manquant." },
      { status: 400 }
    );
  }

  try {
    console.log('Preparing to delete the tour...');
    const { rowCount } = await db.query('DELETE FROM Tournee WHERE id_tournee = $1', [id]);

    if (rowCount === 0) {
      console.warn(`Tour with ID ${id} not found or already deleted.`);
      return NextResponse.json({ error: 'Tournée non trouvée ou déjà supprimée.' }, { status: 404 });
    }

    console.log(`Tour with ID ${id} successfully deleted.`);
    return NextResponse.json({ message: 'Tournée supprimée avec succès.' }, { status: 200 });
  } catch (error) {
    console.error('Error during the tour deletion:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export const runtime = 'nodejs'; // Assurez-vous que l'environnement Node.js est utilisé pour accéder à la base de données.
