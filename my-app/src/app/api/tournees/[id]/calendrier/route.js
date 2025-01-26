import db from '@/lib/db';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/tournees/{id}/calendrier:
 *   get:
 *     tags: [Tournées]
 *     summary: Récupérer le calendrier d'une tournée par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails du calendrier de la tournée
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Tournée non trouvée
 *       500:
 *         description: Erreur serveur
 *   patch:
 *     tags: [Tournées]
 *     summary: Mettre à jour le calendrier d'une tournée par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *               statut_tournee:
 *                 type: string
 *     responses:
 *       200:
 *         description: Calendrier de la tournée mis à jour
 *       400:
 *         description: Champs requis manquants ou invalides
 *       404:
 *         description: Tournée non trouvée
 *       500:
 *         description: Erreur serveur
 *   delete:
 *     tags: [Tournées]
 *     summary: Supprimer le calendrier d'une tournée par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Calendrier de la tournée supprimé
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Tournée non trouvée
 *       500:
 *         description: Erreur serveur
 */

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
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function PATCH(req) {
  const id = req.nextUrl.pathname.split('/').pop();
  const { jour_preparation, jour_livraison, statut_tournee } = await req.json();

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "L'ID de la tournée est invalide." }, { status: 400 });
  }

  if (!jour_preparation && !jour_livraison && !statut_tournee) {
    return NextResponse.json({ error: 'Au moins un champ (jour_preparation, jour_livraison, statut_tournee) doit être fourni.' }, { status: 400 });
  }

  try {
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

    params.push(id);
    const query = `UPDATE Tournee SET ${updates.join(', ')} WHERE id_tournee = $${paramIndex} RETURNING *`;

    const { rows } = await db.query(query, params);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Tournée non trouvée ou mise à jour échouée.' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const id = req.nextUrl.pathname.split('/').pop();

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "L'ID de la tournée est invalide." }, { status: 400 });
  }

  try {
    const { rowCount } = await db.query('DELETE FROM Tournee WHERE id_tournee = $1', [id]);

    if (rowCount === 0) {
      return NextResponse.json({ error: 'Tournée non trouvée ou déjà supprimée.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Tournée supprimée avec succès.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
