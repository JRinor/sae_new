import { NextResponse } from 'next/server';
import db from '@/lib/db';

/**
 * @swagger
 * /api/tournees/{id}:
 *   get:
 *     summary: Récupérer une tournée par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la tournée
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
    console.error('Error during the GET request:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/tournees/{id}:
 *   patch:
 *     summary: Mettre à jour une tournée par ID
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
 *         description: Tournée mise à jour
 *       400:
 *         description: Champs requis manquants ou invalides
 *       404:
 *         description: Tournée non trouvée
 *       500:
 *         description: Erreur serveur
 */
export async function PATCH(req) {
  const id = req.nextUrl.pathname.split('/').pop();
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON input' }, { status: 400 });
  }
  const { jour_preparation, jour_livraison, statut_tournee } = body;

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "L'ID de la tournée est invalide." }, { status: 400 });
  }

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

/**
 * @swagger
 * /api/tournees/{id}:
 *   put:
 *     summary: Remplacer une tournée par ID
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
 *         description: Tournée remplacée
 *       400:
 *         description: Champs requis manquants ou invalides
 *       404:
 *         description: Tournée non trouvée
 *       500:
 *         description: Erreur serveur
 */
export async function PUT(req) {
  const id = req.nextUrl.pathname.split('/').pop();
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON input' }, { status: 400 });
  }
  const { jour_preparation, jour_livraison, statut_tournee } = body;

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "L'ID de la tournée est invalide." }, { status: 400 });
  }

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

/**
 * @swagger
 * /api/tournees/{id}:
 *   delete:
 *     summary: Supprimer une tournée par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tournée supprimée
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Tournée non trouvée
 *       500:
 *         description: Erreur serveur
 */
export async function DELETE(req) {
  const id = req.nextUrl.pathname.split('/').pop();

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

/**
 * @swagger
 * /api/tournees/{id}:
 *   post:
 *     summary: Ajouter une nouvelle tournée
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
 *       201:
 *         description: Tournée créée
 *       400:
 *         description: Champs requis manquants ou invalides
 *       500:
 *         description: Erreur serveur
 */
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON input' }, { status: 400 });
  }
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

/**
 * @swagger
 * /api/tournees/{id}:
 *   options:
 *     summary: Obtenir les méthodes autorisées
 *     responses:
 *       200:
 *         description: Méthodes autorisées
 */
export async function OPTIONS() {
  return NextResponse.json(
    { message: 'Méthodes autorisées : GET, POST, PATCH, PUT, DELETE' },
    { status: 200, headers: { 'Allow': 'GET, POST, PATCH, PUT, DELETE' } }
  );
}