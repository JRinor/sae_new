import { NextResponse } from 'next/server';
import pool from '@/lib/db';

function extractTourneeId(pathname) {
  const segments = pathname.split('/');
  return segments[segments.length - 2];
}

/**
 * @swagger
 * /api/tournees/{id}/points-depot:
 *   get:
 *     summary: Récupérer les points de dépôt pour une tournée
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des points de dépôt
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Aucun point de dépôt trouvé
 *       500:
 *         description: Erreur serveur
 */
export async function GET(req) {
  const id = extractTourneeId(req.nextUrl.pathname);

  if (!id || isNaN(id) || id <= 0) {
    console.warn('ID de tournée invalide:', id);
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
      console.warn('Aucun point de dépôt trouvé pour cette tournée:', id);
      return NextResponse.json({ error: 'Aucun point de dépôt trouvé pour cette tournée.' }, { status: 404 });
    }

    console.log('Points de dépôt pour la tournée récupérés avec succès:', points);
    return NextResponse.json({ points }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des points de dépôt pour la tournée :', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/tournees/{id}/points-depot:
 *   post:
 *     summary: Ajouter un point de dépôt à la tournée
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
 *               pointId:
 *                 type: integer
 *               ordre:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Point de dépôt ajouté
 *       400:
 *         description: ID invalide ou champs manquants
 *       500:
 *         description: Erreur serveur
 */
export async function POST(req) {
  const id = extractTourneeId(req.nextUrl.pathname);
  const { pointId, ordre } = await req.json();

  if (!id || isNaN(id) || id <= 0 || !pointId) {
    console.warn('ID de tournée ou ID de point invalide:', { id, pointId });
    return NextResponse.json({ error: 'ID de tournée ou ID de point invalide.' }, { status: 400 });
  }

  let client;
  try {
    client = await pool.connect();
    const query = `
      INSERT INTO Tournee_PointDeDepot (ID_Tournee, ID_PointDeDepot, numero_ordre, ID_Statut)
      VALUES ($1, $2, $3, 1)
      ON CONFLICT (ID_Tournee, ID_PointDeDepot) DO NOTHING;
    `;

    await client.query(query, [id, pointId, ordre || 0]);
    console.log('Point de dépôt ajouté à la tournée avec succès:', { id, pointId, ordre });
    return NextResponse.json({ message: 'Point de dépôt ajouté à la tournée.' }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du point de dépôt à la tournée :', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  } finally {
    if (client) {
      client.release();
    }
  }
}

/**
 * @swagger
 * /api/tournees/{id}/points-depot:
 *   delete:
 *     summary: Supprimer un point de dépôt de la tournée
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
 *               pointId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Point de dépôt supprimé
 *       400:
 *         description: ID invalide ou champs manquants
 *       500:
 *         description: Erreur serveur
 */
export async function DELETE(req) {
  const tourneeId = extractTourneeId(req.nextUrl.pathname);
  const { pointId } = await req.json();

  if (!tourneeId || !pointId) {
    console.warn('ID de tournée ou de point manquant:', { tourneeId, pointId });
    return NextResponse.json({ error: 'ID de tournée ou de point manquant.' }, { status: 400 });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query(
      'DELETE FROM Tournee_PointDeDepot WHERE ID_Tournee = $1 AND ID_PointDeDepot = $2',
      [tourneeId, pointId]
    );
    console.log('Point retiré de la tournée avec succès:', { tourneeId, pointId });
    return NextResponse.json({ message: 'Point retiré de la tournée.' }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la suppression du point de dépôt de la tournée :', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  } finally {
    if (client) {
      client.release();
    }
  }
}
