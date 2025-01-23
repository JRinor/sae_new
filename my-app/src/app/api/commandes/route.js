// src/app/api/commandes/route.js
import pool from '@/lib/db';

/**
 * @swagger
 * /api/commandes:
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

export async function POST(req) {
  const { id_abonnement, id_point_de_depot, quantite, date_livraison, statut } = await req.json();

  // Validation simplifiée ou autre code de validation
  const statutsValides = ['en attente', 'en cours', 'livrée', 'annulée'];
  if (statut && !statutsValides.includes(statut)) {
    return new Response(JSON.stringify({ error: 'Statut invalide' }), { status: 400 });
  }

  try {
    const query = `
      INSERT INTO commandes (id_abonnement, id_point_de_depot, quantite, date_livraison, statut)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_commande, id_abonnement, id_point_de_depot, quantite, date_livraison, statut
    `;
    const values = [id_abonnement, id_point_de_depot, quantite, date_livraison, statut];

    const { rows } = await pool.query(query, values);
    return new Response(JSON.stringify(rows[0]), { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur.' }), { status: 500 });
  }
}
