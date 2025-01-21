// src/components/Header.js
"use client"; // Assurez-vous de marquer ce fichier comme client-side

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // Utilisez next/navigation au lieu de next/router
import routes from "../config/routes"; // Import des routes depuis config

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  // Gestion des clics externes pour fermer le menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }

    return () => window.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 left-0 flex justify-between items-center px-8 py-4 w-full z-10 text-white font-serif bg-transparent">
      {/* Logo avec redirection vers l'accueil */}
      <div
        className="text-3xl font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        JC
      </div>

      {/* Bouton du menu hamburger */}
      <button
        className="md:hidden text-4xl"
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen(!isMenuOpen);
        }}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Boîte de navigation */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-2/3 bg-red-900 bg-opacity-90 text-white transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } z-50 md:hidden flex flex-col justify-center items-center`}
      >
        <nav className="flex flex-col gap-8 text-center">
          {routes.map((route) => (
            <button
              key={route.path}
              className="text-2xl font-light tracking-wide hover:text-green-400 transition-all"
              onClick={() => {
                router.push(route.path);
                setIsMenuOpen(false);
              }}
            >
              {route.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Navigation classique pour les grands écrans */}
      <nav className="hidden md:flex gap-10">
        {routes.map((route) => (
          <button
            key={route.path}
            className="text-lg font-serif tracking-wide hover:text-green-400 transition-colors"
            onClick={() => router.push(route.path)}
          >
            {route.name}
          </button>
        ))}
      </nav>
    </header>
  );
}
