"use client";

import { useEffect, useState } from 'react';
import Map from '@/components/Map';

const Tournees = () => {
  const [tournees, setTournees] = useState([]); // Toutes les tournées
  const [selectedTournee, setSelectedTournee] = useState(null); // Tournée sélectionnée
  const [pointsDepot, setPointsDepot] = useState([]); // Tous les points de dépôt
  const [mapPoints, setMapPoints] = useState([]); // Points à afficher sur la carte
  const [instructions, setInstructions] = useState([]); // Instructions de navigation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger toutes les tournées et points de dépôt au démarrage
  useEffect(() => {
    const fetchTournees = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/tournees/index');
        if (!response.ok) throw new Error('Erreur lors de la récupération des tournées');
        const data = await response.json();
        setTournees(data);

        // Charger les points de toutes les tournées
        const allPoints = await Promise.all(
            data.map(async (tournee) => {
              const pointsResponse = await fetch(`/api/tournees/${tournee.id_tournee}/points-depot`);
              if (!pointsResponse.ok) return [];
              const pointsData = await pointsResponse.json();
              return pointsData.points;
            })
        );

        // Aplatir et combiner tous les points
        const combinedPoints = allPoints.flat();
        setMapPoints(combinedPoints);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTournees();
  }, []);

  // Charger tous les points de dépôt disponibles
  useEffect(() => {
    const fetchPointsDepot = async () => {
      try {
        const response = await fetch('/api/points-depot');
        if (!response.ok) throw new Error('Erreur lors de la récupération des points de dépôt');
        const data = await response.json();
        setPointsDepot(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPointsDepot();
  }, []);

  // Gérer la sélection d'une tournée
  const handleTourneeSelect = async (tourneeId) => {
    setLoading(true);
    try {
      if (!tourneeId) {
        // Si aucune tournée n'est sélectionnée, afficher tous les points
        const allPointsResponse = await Promise.all(
            tournees.map(async (tournee) => {
              const response = await fetch(`/api/tournees/${tournee.id_tournee}/points-depot`);
              if (!response.ok) return [];
              return response.json();
            })
        );
        setMapPoints(allPointsResponse.flat());
        setSelectedTournee(null);
        setInstructions([]);
      } else {
        // Charger les points de la tournée sélectionnée
        const response = await fetch(`/api/tournees/${tourneeId}/points-depot`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des points de la tournée');
        const data = await response.json();
        setMapPoints(data.points);
        setSelectedTournee(tourneeId);

        // Charger les instructions de navigation
        const routeResponse = await fetch(`/api/tournees/${tourneeId}/route`);
        if (!routeResponse.ok) throw new Error('Erreur lors de la récupération des instructions de navigation');
        const routeData = await routeResponse.json();
        setInstructions(routeData.instructions);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un point à la tournée sélectionnée
  const handleAddPoint = async (pointId) => {
    if (!selectedTournee || !pointId) return;

    try {
      const response = await fetch(`/api/tournees/${selectedTournee}/points-depot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pointId })
      });

      if (!response.ok) throw new Error('Erreur lors de l\'ajout du point');

      // Recharger les points de la tournée
      await handleTourneeSelect(selectedTournee);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          {/* En-tête */}
          <h1 className="text-3xl font-bold mb-8">Gestion des Tournées</h1>

          {/* Messages d'erreur */}
          {error && (
              <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
                {error}
              </div>
          )}

          {/* Sélection de tournée */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Sélectionner une tournée</h2>
            <div className="flex gap-4">
              <button
                  onClick={() => handleTourneeSelect(null)}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                      !selectedTournee
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600'
                  }`}
              >
                Toutes les tournées
              </button>
              {tournees.map((tournee) => (
                  <button
                      key={tournee.id_tournee}
                      onClick={() => handleTourneeSelect(tournee.id_tournee)}
                      className={`px-6 py-2 rounded-lg transition-colors ${
                          selectedTournee === tournee.id_tournee
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                  >
                    Tournée {tournee.id_tournee}
                  </button>
              ))}
            </div>
          </div>

          {/* Ajout de point */}
          {selectedTournee && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Ajouter un point de dépôt</h2>
                <select
                    onChange={(e) => handleAddPoint(e.target.value)}
                    className="bg-gray-800 text-white p-2 rounded-lg w-full max-w-md"
                    defaultValue=""
                >
                  <option value="" disabled>Sélectionner un point de dépôt</option>
                  {pointsDepot.map((point) => (
                      <option
                          key={point.id_pointdedepot}
                          value={point.id_pointdedepot}
                      >
                        {point.nom} - {point.adresse}
                      </option>
                  ))}
                </select>
              </div>
          )}

          {/* Carte */}
          <div className="h-[600px] bg-gray-800 rounded-lg overflow-hidden">
            {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
            ) : (
                <Map points={mapPoints} instructions={instructions} />
            )}
          </div>
        </div>
      </div>
  );
};

export default Tournees;