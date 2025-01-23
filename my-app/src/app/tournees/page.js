'use client';

import { useState, useEffect } from 'react';
import Map from '../../components/Map';
import Header from '@/components/Header';

const Tournees = () => {
    const [points, setPoints] = useState([]);
    const [allPoints, setAllPoints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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
        setCurrentTournee(tourneeId);

        try {
            const response = await fetch(`/api/tournees/${tourneeId}/points-depot`);
            if (!response.ok) throw new Error('Erreur lors de la récupération des points de la tournée.');
            const data = await response.json();
            setPoints(data.points || []);
        } catch (err) {
            console.error('Erreur :', err);
            setError('Impossible de charger les points de la tournée.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToItinerary = async (pointId) => {
        console.log('Adding point:', pointId, 'to tournee:', currentTournee); // Debug log

        if (!currentTournee) {
            setError("Veuillez sélectionner une tournée.");
            return;
        }

        if (!pointId) {
            setError("Point de dépôt invalide.");
            return;
        }

        try {
            const payload = {
                pointId: parseInt(pointId),
                ordre: points.length + 1
            };

            console.log('Sending payload:', payload); // Debug log

            const response = await fetch(`/api/tournees/${currentTournee}/points-depot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de l\'ajout du point à l\'itinéraire.');
            }

            await handleLoadTournee(currentTournee);
            setError(null);
        } catch (err) {
            console.error('Erreur:', err);
            setError(err.message || 'Impossible d\'ajouter le point à l\'itinéraire.');
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Header /> {/* Ensure Header is used */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-sm shadow-xl">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-center gap-6">
                        <button
                            onClick={() => handleLoadTournee(1)}
                            className="btn-tournee bg-gradient-to-r from-red-600 to-red-500 text-white"
                        >
                            Tournée 1
                        </button>
                        <button
                            onClick={() => handleLoadTournee(2)}
                            className="btn-tournee bg-gradient-to-r from-green-600 to-green-500 text-white"
                        >
                            Tournée 2
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 pt-28 pb-8 flex-grow">
                {error && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg animate-fade-in">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {loading && (
                    <div className="flex justify-center items-center p-4">
                        <div className="loading-spinner"></div>
                    </div>
                )}

                <div className="grid lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm shadow-lg">
                            {!loading && allPoints.length > 0 && (
                                <div className="space-y-4">
                                    <label className="block text-lg font-medium text-gray-200">
                                        Points de dépôt
                                    </label>
                                    <ul className="space-y-2">
                                        {allPoints.map((point) => (
                                            <li 
                                                key={point.id_pointdedepot} 
                                                className="flex justify-between items-center p-2 bg-gray-700/50 rounded-lg"
                                            >
                                                <span className="text-sm">{point.nom}</span>
                                                <button
                                                    onClick={() => handleAddToItinerary(point.id_pointdedepot)}
                                                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-sm transition-colors"
                                                    disabled={!currentTournee}
                                                >
                                                    Ajouter
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-3 bg-gray-800/50 rounded-xl overflow-hidden shadow-lg">
                        <div className="h-[600px]">
                            <Map points={Array.isArray(points) ? points : []} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Tournees;
