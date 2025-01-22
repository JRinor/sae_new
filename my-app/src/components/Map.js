"use client";

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { FaArrowRight, FaArrowLeft, FaArrowUp, FaFlagCheckered, FaSyncAlt } from 'react-icons/fa';

const Map = ({ points = [], instructions = [] }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routingControlRef = useRef(null);
  const [leaflet, setLeaflet] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialisation de Leaflet
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initLeaflet = async () => {
      try {
        const L = await import('leaflet');
        await import('leaflet-routing-machine');

        // Configuration des icônes par défaut
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
        });

        setLeaflet(L);
      } catch (error) {
        console.error('Erreur lors du chargement de Leaflet:', error);
      }
    };

    initLeaflet();
  }, []);

  // Initialisation de la carte
  useEffect(() => {
    if (!leaflet || !mapRef.current || mapInstanceRef.current) return;

    try {
      const map = leaflet.map(mapRef.current, {
        center: [48.18333, 6.45],
        zoom: 13
      });

      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
      setIsMapReady(true);

      return () => {
        map.remove();
        mapInstanceRef.current = null;
        setIsMapReady(false);
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
    }
  }, [leaflet]);

  // Mise à jour des points et du routage
  useEffect(() => {
    if (!isMapReady || !leaflet || !mapInstanceRef.current || !Array.isArray(points) || points.length === 0) return;

    const updateMap = async () => {
      try {
        // Nettoyage des marqueurs existants
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Nettoyage du routage existant
        if (routingControlRef.current) {
          routingControlRef.current.remove();
        }

        // Filtrage et validation des points
        const validPoints = points.filter(point =>
            point &&
            point.latitude &&
            point.longitude &&
            !isNaN(parseFloat(point.latitude)) &&
            !isNaN(parseFloat(point.longitude))
        );

        if (validPoints.length === 0) return;

        // Création des marqueurs
        const latLngs = validPoints.map(point => {
          const latLng = [parseFloat(point.latitude), parseFloat(point.longitude)];
          const marker = leaflet.marker(latLng)
              .bindPopup(`<strong>${point.nom}</strong><br>${point.adresse}`)
              .addTo(mapInstanceRef.current);
          markersRef.current.push(marker);
          return latLng;
        });

        // Ajustement de la vue
        const bounds = leaflet.latLngBounds(latLngs);
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });

        // Configuration du routage
        if (latLngs.length > 1 && leaflet.Routing) {
          const control = leaflet.Routing.control({
            waypoints: latLngs.map(latLng => leaflet.latLng(latLng[0], latLng[1])),
            routeWhileDragging: false,
            showAlternatives: false,
            fitSelectedRoutes: false,
            show: false,
            lineOptions: {
              styles: [{ color: '#3B82F6', opacity: 0.7, weight: 5 }]
            }
          }).addTo(mapInstanceRef.current);

          routingControlRef.current = control;

          control.on('routesfound', (e) => {
            if (e.routes?.[0]?.instructions) {
              const steps = e.routes[0].instructions.map((step, index) => ({
                id: index,
                distance: step.distance,
                text: translateInstruction(step.text),
                icon: getInstructionIcon(step.text)
              }));
              setInstructions(steps);
            }
          });
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la carte:', error);
        setInstructions([]);
      }
    };

    updateMap();

    return () => {
      if (routingControlRef.current) {
        routingControlRef.current.remove();
        routingControlRef.current = null;
      }
    };
  }, [points, isMapReady, leaflet]);

  const translateInstruction = (text) => {
    const translations = {
      'Head north': 'Dirigez-vous vers le nord',
      'Head northeast': 'Dirigez-vous vers le nord-est',
      'Head east': 'Dirigez-vous vers l\'est',
      'Head southeast': 'Dirigez-vous vers le sud-est',
      'Head south': 'Dirigez-vous vers le sud',
      'Head southwest': 'Dirigez-vous vers le sud-ouest',
      'Head west': 'Dirigez-vous vers l\'ouest',
      'Head northwest': 'Dirigez-vous vers le nord-ouest',
      'Turn right': 'Tournez à droite',
      'Turn left': 'Tournez à gauche',
      'Continue straight': 'Continuez tout droit',
      'Keep right': 'Restez à droite',
      'Keep left': 'Restez à gauche',
      'Enter roundabout': 'Entrez dans le rond-point',
      'Exit roundabout': 'Sortez du rond-point',
      'Arrive at destination': 'Arrivée à destination'
    };

    return Object.entries(translations).reduce((acc, [en, fr]) =>
        acc.replace(new RegExp(en, 'gi'), fr), text);
  };

  const getInstructionIcon = (text) => {
    const text_lower = text.toLowerCase();
    if (text_lower.includes('right')) return <FaArrowRight className="text-blue-500" size={20} />;
    if (text_lower.includes('left')) return <FaArrowLeft className="text-blue-500" size={20} />;
    if (text_lower.includes('straight')) return <FaArrowUp className="text-blue-500" size={20} />;
    if (text_lower.includes('roundabout')) return <FaSyncAlt className="text-blue-500" size={20} />;
    if (text_lower.includes('destination')) return <FaFlagCheckered className="text-green-500" size={20} />;
    return <FaArrowUp className="text-blue-500" size={20} />;
  };

  return (
      <div className="flex flex-row h-full">
        <div ref={mapRef} className="w-7/10 h-full" style={{ height: '600px' }} />
        {instructions.length > 0 && (
            <div className="w-3/10 h-full bg-white overflow-y-auto p-4 border-l border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Instructions de navigation
              </h3>
              <ul className="space-y-2">
                {instructions.map((instruction) => (
                    <li
                        key={instruction.id}
                        className="flex items-start p-2 border-b border-gray-100"
                    >
                      <span className="mr-3 mt-1">{instruction.icon}</span>
                      <div className="flex-1">
                        <p className="text-gray-800">{instruction.text}</p>
                        <span className="text-sm text-gray-500">
                    {Math.round(instruction.distance)}m
                  </span>
                      </div>
                    </li>
                ))}
              </ul>
            </div>
        )}
      </div>
  );
};

export default dynamic(() => Promise.resolve(Map), {
  ssr: false,
  loading: () => (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
  )
});