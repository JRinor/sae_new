// app/api/tournees/[id]/calendrier/route.js
import db from '@/lib/db';

export async function handler(req, res) {
  const { id } = req.query;

  if (!id || isNaN(id)) {
    console.error(`ID invalide ou manquant pour la tournée : ${id}`);  // Log d'erreur
    return res.status(400).json({ error: "L'ID de la tournée est invalide ou manquant." });
  }

  if (req.method === 'GET') {
    try {
      console.log(`Demande GET reçue pour la tournée avec l'ID: ${id}`);  // Log de débogage
      const { rows } = await db.query('SELECT * FROM Tournee WHERE id_tournee = $1', [id]);

      if (rows.length === 0) {
        console.log(`Aucune tournée trouvée pour l'ID: ${id}`);  // Log de débogage
        return res.status(404).json({ error: 'Tournée non trouvée.' });
      }

      console.log(`Tournée récupérée pour l'ID: ${id}`, rows[0]);  // Log de débogage
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la tournée pour l'ID: ${id}:`, error);  // Log d'erreur
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  } else if (req.method === 'PATCH') {
    const { jour_preparation, jour_livraison, statut_tournee } = req.body;

    if (!jour_preparation && !jour_livraison && !statut_tournee) {
      console.error(`Aucun champ à mettre à jour pour la tournée avec l'ID: ${id}`);  // Log d'erreur
      return res
        .status(400)
        .json({ error: 'Au moins un champ (jour_preparation, jour_livraison, statut_tournee) doit être fourni.' });
    }

    try {
      console.log(`Demande PATCH reçue pour la tournée avec l'ID: ${id}`);  // Log de débogage
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
        console.log(`Tournée non trouvée ou mise à jour échouée pour l'ID: ${id}`);  // Log de débogage
        return res.status(404).json({ error: 'Tournée non trouvée ou mise à jour échouée.' });
      }

      console.log(`Tournée mise à jour avec succès pour l'ID: ${id}`, rows[0]);  // Log de débogage
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la tournée pour l'ID: ${id}:`, error);  // Log d'erreur
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  } else if (req.method === 'DELETE') {
    try {
      console.log(`Demande DELETE reçue pour la tournée avec l'ID: ${id}`);  // Log de débogage
      const { rowCount } = await db.query('DELETE FROM Tournee WHERE id_tournee = $1', [id]);

      if (rowCount === 0) {
        console.log(`Tournée non trouvée ou déjà supprimée pour l'ID: ${id}`);  // Log de débogage
        return res.status(404).json({ error: 'Tournée non trouvée ou déjà supprimée.' });
      }

      console.log(`Tournée supprimée avec succès pour l'ID: ${id}`);  // Log de débogage
      return res.status(200).json({ message: 'Tournée supprimée avec succès.' });
    } catch (error) {
      console.error(`Erreur lors de la suppression de la tournée pour l'ID: ${id}:`, error);  // Log d'erreur
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  } else {
    console.error(`Méthode ${req.method} non autorisée pour l'ID: ${id}`);  // Log d'erreur
    res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
    return res.status(405).json({ error: `Méthode ${req.method} non autorisée.` });
  }
}
