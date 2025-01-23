import db from '@/lib/db'; 
import jwt from 'jsonwebtoken';

export async function GET(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return new Response(JSON.stringify({ error: 'Token manquant.' }), { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, 'votre_secret');
    const { rows } = await db.query('SELECT * FROM AppUser WHERE ID_User = $1', [decoded.id]); 
    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la récupération des utilisateurs.' }), { status: 500 });
  }
}
