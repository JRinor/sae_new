"use client"; // Ajoute cette ligne en haut du fichier

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MonEspace() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('/api/auth/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/login');
      });
  }, [router]);

  if (!user) {
    return <div>Chargement....</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mon Espace</h1>
      <p>Bienvenue, {user.prenom} {user.nom}!</p>
      <p>Email: {user.email}</p>
      <p>Rôle: {user.role}</p>
    </div>
  );
}
