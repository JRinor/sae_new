// File: src/app/api/structures/route.js
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query('SELECT * FROM Structure');
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la récupération des structures' }), { status: 500 });
  }
}
