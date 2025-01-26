import db from '@/lib/db';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     tags: [Auth]
 *     summary: Récupérer les informations de l'utilisateur connecté
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *       401:
 *         description: Token manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */

export async function GET(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return new Response(JSON.stringify({ error: 'Token manquant.' }), { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, 'votre_secret');
    const { rows } = await db.query('SELECT * FROM AppUser WHERE ID_User = $1', [decoded.id]); 

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Utilisateur non trouvé.' }), { status: 404 });
    }

    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return new Response(JSON.stringify({ error: 'Token invalide.' }), { status: 401 });
    }
    return new Response(JSON.stringify({ error: 'Erreur lors de la récupération des utilisateurs.' }), { status: 500 });
  }
}
