import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="relative">
      <main
        className="h-screen w-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/img/image1.jpg')" }}
      >
        <div className="flex flex-col items-center justify-center h-full bg-black bg-opacity-50">
          <h1 className="text-6xl font-serif text-white drop-shadow-lg shadow-black text-center">
            Jardins de Cocagne
          </h1>
          <p className="text-xl text-white mt-4 drop-shadow-md shadow-black text-center flex items-center gap-2">
            <span>🌱</span> Du bio, local et solidaire à votre portée !
          </p>
        </div>
      </main>
    </div>
  );
}
