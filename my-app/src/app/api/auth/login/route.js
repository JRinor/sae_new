import db from '@/lib/db';  // Utilisation de db pour la gestion de la base de données
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { email, mot_de_passe } = await req.json();

  try {
    const { rows } = await db.query('SELECT * FROM AppUser WHERE email = $1', [email]);  // Utilisation de db.query
    const user = rows[0];

    if (!user) {
      return new Response(JSON.stringify({ error: 'Email ou mot de passe incorrect.' }), { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: 'Email ou mot de passe incorrect.' }), { status: 401 });
    }

    const token = jwt.sign({ id: user.id_user, role: user.id_role }, 'votre_secret', { expiresIn: '1h' });

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la connexion.' }), { status: 500 });
  }
}
