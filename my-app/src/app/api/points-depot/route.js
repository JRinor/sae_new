import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * @swagger
 * /api/points-depot:
 *   get:
 *     tags: [Points de Dépôt]
 *     summary: Récupérer tous les points de dépôt
 *     responses:
 *       200:
 *         description: Liste des points de dépôt
 *       404:
 *         description: Aucun point de dépôt trouvé
 *       500:
 *         description: Erreur serveur
 *   post:
 *     tags: [Points de Dépôt]
 *     summary: Ajouter un nouveau point de dépôt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               adresse:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               id_structure:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Point de dépôt créé
 *       500:
 *         description: Erreur serveur
 *   put:
 *     tags: [Points de Dépôt]
 *     summary: Mettre à jour un point de dépôt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               nom:
 *                 type: string
 *               adresse:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Point de dépôt mis à jour
 *       500:
 *         description: Erreur serveur
 *   delete:
 *     tags: [Points de Dépôt]
 *     summary: Supprimer un point de dépôt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Point de dépôt supprimé
 *       500:
 *         description: Erreur serveur
 */
export async function GET() {
  try {
    const client = await pool.connect();
    const query = `
      SELECT ID_PointDeDepot, nom, adresse, latitude, longitude
      FROM PointDeDepot
      ORDER BY nom
    `;
    const result = await client.query(query);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Aucun point de dépôt trouvé.' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des points de dépôt :', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function POST(req) {
  const { nom, adresse, latitude, longitude, id_structure } = await req.json();

  try {
    const client = await pool.connect();
    const query = `
      INSERT INTO PointDeDepot (nom, adresse, latitude, longitude, ID_Structure)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await client.query(query, [nom, adresse, latitude, longitude, id_structure]);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function PUT(req) {
  const { id, nom, adresse, latitude, longitude } = await req.json();

  try {
    const client = await pool.connect();
    const query = `
      UPDATE PointDeDepot
      SET nom = $2, adresse = $3, latitude = $4, longitude = $5
      WHERE ID_PointDeDepot = $1
      RETURNING *
    `;
    const result = await client.query(query, [id, nom, adresse, latitude, longitude]);
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();

  try {
    const client = await pool.connect();
    await client.query('DELETE FROM PointDeDepot WHERE ID_PointDeDepot = $1', [id]);
    return NextResponse.json({ message: 'Point de dépôt supprimé.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
