import './globals.css';
import Header from '@/components/Header';

export default function Layout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Header /> {/* Ensure Header is used */}
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}