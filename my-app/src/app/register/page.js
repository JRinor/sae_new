"use client"; // Ajoute cette ligne en haut du fichier

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [role, setRole] = useState('user');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nom, prenom, email, mot_de_passe: motDePasse, role }),
    });

    if (res.ok) {
      router.push('/login');
    } else {
      alert("Erreur lors de l'inscription.");
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
          🌸 Inscription 🌸
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Nom */}
          <div className="relative mb-6">
            <label htmlFor="nom" className="text-sm font-medium text-green-700">
              Nom
            </label>
            <input
              type="text"
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Entrez votre nom"
              className="mt-1 block w-full pl-3 pr-3 py-2 text-base border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-700"
            />
          </div>

          {/* Prénom */}
          <div className="relative mb-6">
            <label htmlFor="prenom" className="text-sm font-medium text-green-700">
              Prénom
            </label>
            <input
              type="text"
              id="prenom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Entrez votre prénom"
              className="mt-1 block w-full pl-3 pr-3 py-2 text-base border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-700"
            />
          </div>

          {/* Email */}
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
              className="mt-1 block w-full pl-3 pr-3 py-2 text-base border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-700"
            />
          </div>

          {/* Mot de passe */}
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
              className="mt-1 block w-full pl-3 pr-3 py-2 text-base border border-green-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-700"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300"
          >
            S'inscrire
          </button>
        </form>
        <p className="text-center text-sm text-green-700 mt-6">
          Déjà inscrit ?{' '}
          <a
            href="/login"
            className="text-green-500 hover:text-green-600 font-medium"
          >
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  );
}