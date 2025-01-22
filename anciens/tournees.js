import { useState, useEffect } from 'react';
import Map from '../components/Map';

const Tournees = () => {
    const [points, setPoints] = useState([]); // Points liés à la tournée en cours
    const [allPoints, setAllPoints] = useState([]); // Tous les points de dépôt
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPoint, setSelectedPoint] = useState(""); // Point sélectionné
    const [itineraries, setItineraries] = useState({}); // Itinéraires par tournée
    const [currentTournee, setCurrentTournee] = useState(null); // ID de la tournée en cours

    // Charger tous les points de dépôt au chargement de la page
    useEffect(() => {
        const fetchAllPoints = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/points'); // Modification ici
                if (!response.ok) throw new Error('Erreur lors de la récupération des points de dépôt.');
                const data = await response.json();
                setAllPoints(data); // Stocker tous les points
            } catch (err) {
                console.error(err);
                setError('Impossible de charger tous les points de dépôt.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllPoints();
    }, []);

    // Charger les points d'une tournée spécifique
    const handleLoadTournee = async (tourneeId) => {
        setLoading(true);
        setError(null);

        // Sauvegarder l'itinéraire actuel avant de changer de tournée
        if (currentTournee !== null) {
            setItineraries((prevItineraries) => ({
                ...prevItineraries,
                [currentTournee]: points,
            }));
        }

        // Vérifier si la tournée a déjà été chargée
        if (itineraries[tourneeId]) {
            setPoints(itineraries[tourneeId]);
            setCurrentTournee(tourneeId);
            setLoading(false);
            return;
        }

        // Charger les points pour une nouvelle tournée
        try {
            const response = await fetch(`/api/tournees/${tourneeId}/points`);
            if (!response.ok) throw new Error('Erreur lors de la récupération des points de la tournée.');
            const data = await response.json();
            setPoints(data);
            setCurrentTournee(tourneeId); // Mettre à jour la tournée active
        } catch (err) {
            console.error('Erreur :', err);
            setError('Impossible de charger les points de la tournée.');
        } finally {
            setLoading(false);
        }
    };

    // Ajouter un point de dépôt sélectionné à l'itinéraire
    const handleAddToItinerary = () => {
        if (!selectedPoint || !currentTournee) return;

        // Trouver le point complet à partir de `allPoints`
        const pointToAdd = allPoints.find((point) => point.nom === selectedPoint);

        if (pointToAdd) {
            // Vérifier si le point n'est pas déjà dans l'itinéraire
            const alreadyInItinerary = points.some((p) => p.nom === pointToAdd.nom);
            if (!alreadyInItinerary) {
                setPoints((prevPoints) => [...prevPoints, pointToAdd]); // Ajouter le point
            } else {
                alert('Ce point est déjà dans l\'itinéraire.');
            }
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 pt-40">
            {/* Conteneur pour centrer les boutons */}
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

            {/* Erreur */}
            {error && (
                <div className="bg-black border border-red-700 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Chargement */}
            {loading && <div className="text-center py-4">Chargement...</div>}

            {/* Carte des points de la tournée */}
            <div className="w-full mt-6">
                <Map points={points} />
            </div>

            {/* Liste déroulante pour tous les points de dépôt */}
            {!loading && allPoints.length > 0 && (
                <div className="mt-6">
                    <label htmlFor="point-select" className="block text-lg font-semibold mb-2">
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

                    {/* Bouton pour ajouter le point à l'itinéraire */}
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
