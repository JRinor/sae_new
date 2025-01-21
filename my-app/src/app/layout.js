import './globals.css'; // Assure-toi d'importer le CSS global
import Header from '@/components/Header'; // Importer le Header

export default function Layout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Header /> {/* Ajouter le Header */}
        {children} {/* Le contenu de la page */}
      </body>
    </html>
  );
}
