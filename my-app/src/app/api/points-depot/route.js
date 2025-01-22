import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const client = await pool.connect();
        try {
            const query = `
                SELECT ID_PointDeDepot, nom, adresse, latitude, longitude
                FROM PointDeDepot
                ORDER BY nom
            `;
            const result = await client.query(query);

            if (result.rows.length === 0) {
                console.log('Aucun point de dépôt trouvé.');
                return NextResponse.json({ error: 'Aucun point de dépôt trouvé.' }, { status: 404 });
            }

            console.log('Points de dépôt récupérés :', result.rows);
            return NextResponse.json(result.rows, { status: 200 });
        } finally {
            client.release(); // Libère la connexion
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des points de dépôt :', error);
        return NextResponse.json({ error: 'Erreur serveur. Vérifiez la connexion à la base de données.' }, { status: 500 });
    }
}

export async function POST(req) {
  const { nom, adresse, latitude, longitude, id_structure } = await req.json();
  
  try {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO PointDeDepot (nom, adresse, latitude, longitude, ID_Structure)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const result = await client.query(query, [nom, adresse, latitude, longitude, id_structure]);
      return NextResponse.json(result.rows[0], { status: 201 });
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function PUT(req) {
  const { id, nom, adresse, latitude, longitude } = await req.json();
  
  try {
    const client = await pool.connect();
    try {
      const query = `
        UPDATE PointDeDepot 
        SET nom = $2, adresse = $3, latitude = $4, longitude = $5
        WHERE ID_PointDeDepot = $1
        RETURNING *
      `;
      const result = await client.query(query, [id, nom, adresse, latitude, longitude]);
      return NextResponse.json(result.rows[0], { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();
  
  try {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM PointDeDepot WHERE ID_PointDeDepot = $1', [id]);
      return NextResponse.json({ message: 'Point de dépôt supprimé.' }, { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

export const runtime = 'nodejs'; // Assurez-vous que l'environnement Node.js est utilisé pour accéder à la base de données.