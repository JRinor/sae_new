import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { nom, prenom, email, mot_de_passe, role } = await req.json();

  // Hash the password
  const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

  try {
    const { rows } = await db.query(  // Utilisation de db pour la requête
      'INSERT INTO AppUser (nom, prenom, email, mot_de_passe, ID_Role) VALUES ($1, $2, $3, $4, (SELECT ID_Role FROM Role WHERE nom = $5)) RETURNING *',
      [nom, prenom, email, hashedPassword, role]
    );
    return new Response(JSON.stringify(rows[0]), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Erreur lors de l\'inscription.' }), { status: 500 });
  }
}
