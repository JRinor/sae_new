'use client';

import { useState, useEffect } from 'react';

const Commande = () => {
  const [abonnements, setAbonnements] = useState([]);
  const [points, setPoints] = useState([]);
  const [commande, setCommande] = useState({
    id_abonnement: '',
    id_point_de_depot: '',
    quantite: 1,
    date_livraison: '',
    statut: 'en attente',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetch('/api/abonnements')
      .then(res => res.json())
      .then(data => setAbonnements(data))
      .catch(err => setError('Erreur lors du chargement des abonnements'));

    fetch('/api/points')
      .then(res => res.json())
      .then(data => setPoints(data))
      .catch(err => setError('Erreur lors du chargement des points de dépôt'));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    fetch('/api/commandes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commande),
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => { throw new Error(text) });
        }
        return res.json();
      })
      .then(data => {
        setSuccess('Commande créée avec succès');
      })
      .catch(error => {
        console.error('Erreur lors de la création de la commande:', error);
        setError('Erreur lors de la création de la commande');
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Passer une commande</h1>
      {error && <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-4 mb-4 rounded">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="abonnement" className="block text-sm font-medium text-gray-700">Sélectionner un abonnement</label>
          <select
            id="abonnement"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={(e) => setCommande({ ...commande, id_abonnement: e.target.value })}
          >
            <option value="">Sélectionner un abonnement</option>
            {abonnements.map(abonnement => (
              <option key={abonnement.id_abonnement} value={abonnement.id_abonnement}>
                {abonnement.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="point" className="block text-sm font-medium text-gray-700">Sélectionner un point de dépôt</label>
          <select
            id="point"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={(e) => setCommande({ ...commande, id_point_de_depot: e.target.value })}
          >
            <option value="">Sélectionner un point de dépôt</option>
            {points.map(point => (
              <option key={point.id_point_de_depot} value={point.id_point_de_depot}>
                {point.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="quantite" className="block text-sm font-medium text-gray-700">Quantité</label>
          <input
            type="number"
            id="quantite"
            value={commande.quantite}
            onChange={(e) => setCommande({ ...commande, quantite: e.target.value })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date_livraison" className="block text-sm font-medium text-gray-700">Date de livraison</label>
          <input
            type="date"
            id="date_livraison"
            value={commande.date_livraison}
            onChange={(e) => setCommande({ ...commande, date_livraison: e.target.value })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="statut" className="block text-sm font-medium text-gray-700">Statut</label>
          <select
            id="statut"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={commande.statut}
            onChange={(e) => setCommande({ ...commande, statut: e.target.value })}
          >
            <option value="en attente">En attente</option>
            <option value="en cours">En cours</option>
            <option value="livrée">Livrée</option>
            <option value="annulée">Annulée</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Passer la commande
        </button>
      </form>
    </div>
  );
};

export default Commande;
