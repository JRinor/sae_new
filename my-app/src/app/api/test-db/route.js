import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    return NextResponse.json({ message: 'Connexion réussie', time: result.rows[0].now }, { status: 200 });
  } catch (error) {
    console.error('Erreur de connexion à la base de données :', error);
    return NextResponse.json({ error: 'Erreur de connexion à la base de données' }, { status: 500 });
  }
}
