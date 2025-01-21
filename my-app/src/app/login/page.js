"use client"; // Ajoute cette ligne en haut du fichier

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Login() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !motDePasse) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, mot_de_passe: motDePasse }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token); // Stocker le token dans le localStorage
        router.push('/mon-espace'); // Rediriger l'utilisateur vers son espace personnel
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Email ou mot de passe incorrect.');
      }
    } catch (error) {
      console.error(error);
      setError('Erreur lors de la connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/img/image1.jpg')",
      }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          🌸 Bienvenue 🌸
        </h1>

        {/* Affichage de l'erreur, s'il y en a */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="relative mb-6">
            <label htmlFor="email" className="text-sm font-medium text-green-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre email"
              className="appearance-none bg-transparent border border-green-300 rounded-md w-full text-green-700 pl-2 py-2 shadow-sm focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="relative mb-6">
            <label htmlFor="motDePasse" className="text-sm font-medium text-green-700">
              Mot de passe
            </label>
            <input
              type="password"
              id="motDePasse"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="Entrez votre mot de passe"
              className="appearance-none bg-transparent border border-green-300 rounded-md w-full text-green-700 pl-2 py-2 shadow-sm focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300"
            disabled={loading} // Désactiver le bouton pendant le chargement
          >
            {loading ? 'Chargement...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-sm text-green-700 mt-6">
          Pas encore de compte ?{' '}
          <button
            onClick={() => router.push('/register')}
            className="text-green-500 hover:text-green-600 font-medium"
          >
            Inscrivez-vous
          </button>
        </p>
      </div>
    </div>
  );
}
