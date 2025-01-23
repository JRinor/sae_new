'use client';

import { useState, useEffect } from 'react';
import Map from '../../components/Map';
import Header from '@/components/Header';

const Tournees = () => {
    const [points, setPoints] = useState([]);
    const [allPoints, setAllPoints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPoint, setSelectedPoint] = useState("");
    const [itineraries, setItineraries] = useState({});
    const [currentTournee, setCurrentTournee] = useState(null);

    useEffect(() => {
        const fetchAllPoints = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/points-depot');
                if (!response.ok) throw new Error('Erreur lors de la récupération des points de dépôt.');
                const data = await response.json();
                setAllPoints(data);
                setPoints(data);
            } catch (err) {
                console.error(err);
                setError('Impossible de charger tous les points de dépôt.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllPoints();
    }, []);

    const handleLoadTournee = async (tourneeId) => {
        setLoading(true);
        setError(null);

        if (currentTournee !== null) {
            setItineraries((prevItineraries) => ({
                ...prevItineraries,
                [currentTournee]: points,
            }));
        }

        if (itineraries[tourneeId]) {
            setPoints(itineraries[tourneeId]);
            setCurrentTournee(tourneeId);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/tournees/${tourneeId}/points-depot`);
            if (!response.ok) throw new Error('Erreur lors de la récupération des points de la tournée.');
            const data = await response.json();
            setPoints(data.points);
            setCurrentTournee(tourneeId);
        } catch (err) {
            console.error('Erreur :', err);
            setError('Impossible de charger les points de la tournée.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToItinerary = async () => {
        if (!selectedPoint || !currentTournee) return;

        const pointToAdd = allPoints.find((point) => point.nom === selectedPoint);

        if (pointToAdd) {
            const alreadyInItinerary = points.some((p) => p.nom === pointToAdd.nom);
            if (!alreadyInItinerary) {
                setPoints((prevPoints) => [...prevPoints, pointToAdd]);

                try {
                    const body = JSON.stringify({ pointId: pointToAdd.ID_PointDeDepot, ordre: points.length + 1 });
                    console.log('Sending POST request with body:', body);
                    const response = await fetch(`/api/tournees/${currentTournee}/points-depot`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body,
                    });

                    if (!response.ok) throw new Error('Erreur lors de l\'ajout du point à l\'itinéraire.');
                } catch (err) {
                    console.error('Erreur :', err);
                    setError('Impossible d\'ajouter le point à l\'itinéraire.');
                }
            } else {
                alert('Ce point est déjà dans l\'itinéraire.');
            }
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 pt-40">
            <Header /> {/* Ensure Header is used */}
            <div className="mb-6 flex justify-center space-x-8">
                <button
                    onClick={() => handleLoadTournee(1)}
                    className="bg-red-600 text-white py-4 px-10 rounded-lg shadow-lg hover:bg-red-700 transition duration-300 text-xl font-semibold"
                >
                    Tournée 1
                </button>
                <button
                    onClick={() => handleLoadTournee(2)}
                    className="bg-green-600 text-white py-4 px-10 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 text-xl font-semibold"
                >
                    Tournée 2
                </button>
            </div>

            {error && (
                <div className="bg-black border border-red-700 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {loading && <div className="text-center py-4">Chargement...</div>}

            <div className="w-full mt-6">
                <Map points={Array.isArray(points) ? points : []} />
            </div>

            {!loading && allPoints.length > 0 && (
                <div className="mt-6">
                    <label htmlFor="point-select" className="block text-lg font-semibold mb-2 text-white">
                        Points de dépôt disponibles :
                    </label>
                    <select
                        id="point-select"
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4 bg-black text-white"
                        value={selectedPoint}
                        onChange={(e) => setSelectedPoint(e.target.value)}
                    >
                        <option value="">-- Sélectionnez un point de dépôt --</option>
                        {allPoints.map((point) => (
                            <option key={point.nom} value={point.nom}>
                                {point.nom} - {point.adresse}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleAddToItinerary}
                        className="bg-purple-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-purple-700 transition duration-300"
                    >
                        Ajouter au trajet
                    </button>
                </div>
            )}
        </div>
    );
};

export default Tournees;
