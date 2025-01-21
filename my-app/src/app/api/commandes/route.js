// src/app/api/commandes/route.js
import pool from '@/lib/db'; // Changement d'importation de db

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
