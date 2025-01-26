import pool from '@/lib/db';

/**
 * @swagger
 * /api/commandes:
 *   get:
 *     tags: [Commandes]
 *     summary: Récupérer la liste des commandes
 *     responses:
 *       200:
 *         description: Liste des commandes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_commande:
 *                     type: integer
 *                   id_abonnement:
 *                     type: integer
 *                   id_point_de_depot:
 *                     type: integer
 *                   quantite:
 *                     type: integer
 *                   date_commande:
 *                     type: string
 *                     format: date-time
 *                   statut:
 *                     type: string
 *       500:
 *         description: Erreur serveur
 *   post:
 *     tags: [Commandes]
 *     summary: Créer une nouvelle commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_abonnement:
 *                 type: integer
 *               id_point_de_depot:
 *                 type: integer
 *               quantite:
 *                 type: integer
 *               date_livraison:
 *                 type: string
 *                 format: date
 *               statut:
 *                 type: string
 *     responses:
 *       201:
 *         description: Commande créée
 *       400:
 *         description: Statut invalide
 *       500:
 *         description: Erreur serveur
 */

export async function GET() {
  try {
    const query = `
      SELECT id_commande, id_abonnement, id_pointdedepot, quantite, date_commande, statut
      FROM Commande
      ORDER BY date_commande DESC
    `;
    const { rows } = await pool.query(query);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur.' }), { status: 500 });
  }
}

export async function POST(req) {
  const { id_abonnement, id_point_de_depot, quantite, date_livraison, statut } = await req.json();

  const statutsValides = ['en attente', 'en cours', 'livrée', 'annulée'];
  if (statut && !statutsValides.includes(statut)) {
    return new Response(JSON.stringify({ error: 'Statut invalide' }), { status: 400 });
  }

  try {
    const query = `
      INSERT INTO Commande (id_abonnement, id_pointdedepot, quantite, date_livraison, statut)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_commande, id_abonnement, id_pointdedepot, quantite, date_commande, statut
    `;
    const values = [id_abonnement, id_point_de_depot, quantite, date_livraison, statut];

    const { rows } = await pool.query(query, values);
    return new Response(JSON.stringify(rows[0]), { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur.' }), { status: 500 });
  }
}
