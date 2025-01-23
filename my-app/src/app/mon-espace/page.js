'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

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
      <Header />
      <h1 className="text-2xl font-bold mb-4 text-white">Mon Espace</h1>
      <p className="text-white">Bienvenue, {user.prenom} {user.nom}!</p>
      <p className="text-white">Email: {user.email}</p>
      <p className="text-white">Rôle: {user.role}</p>
    </div>
  );
}
