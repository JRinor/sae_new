import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req) {
    const tourneeId = req.nextUrl.pathname.split('/').pop();

    if (!tourneeId || isNaN(tourneeId)) {
        return NextResponse.json({ error: 'ID de tournée invalide.' }, { status: 400 });
    }

    let client;
    try {
        client = await pool.connect();
        const query = `
            SELECT pd.*
            FROM PointDeDepot pd
            WHERE pd.ID_PointDeDepot NOT IN (
                SELECT tpd.ID_PointDeDepot
                FROM Tournee_PointDeDepot tpd
                WHERE tpd.ID_Tournee = $1
            )
            ORDER BY pd.nom;
        `;
        const result = await client.query(query, [tourneeId]);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des points disponibles:', error);
        return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}

export const runtime = 'nodejs';
