import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { FaArrowRight, FaArrowLeft, FaArrowUp, FaFlagCheckered, FaSyncAlt } from 'react-icons/fa';

const Map = ({ points = [] }) => {
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const routingControlRef = useRef(null);
    const [instructions, setInstructions] = useState([]);

    useEffect(() => {
        const L = require('leaflet');
        require('leaflet-routing-machine');

        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([48.18333, 6.45], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(mapRef.current);
        }

        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];
        if (routingControlRef.current) {
            routingControlRef.current.remove();
        }

        const customIcon = L.icon({
            iconUrl: '/img/icon.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        });

        const latLngs = points.map((point) => {
            const latLng = [parseFloat(point.latitude), parseFloat(point.longitude)];
            const marker = L.marker(latLng, { icon: customIcon })
                .addTo(mapRef.current)
                .bindPopup(`<strong>${point.nom}</strong><br>${point.adresse}`);
            markersRef.current.push(marker);
            return latLng;
        });

        if (latLngs.length > 1) {
            routingControlRef.current = L.Routing.control({
                waypoints: latLngs,
                routeWhileDragging: true,
                createMarker: () => null,
                lineOptions: {
                    styles: [{ color: 'blue', opacity: 1, weight: 5 }],
                },
                show: false,
                addWaypoints: false,
                draggableWaypoints: false,
                fitSelectedRoutes: true,
                showAlternatives: false,
            })
                .on('routesfound', (e) => {
                    const routes = e.routes;
                    const steps = routes[0].instructions.map((step) => ({
                        distance: step.distance,
                        text: translateInstruction(step.text),
                        icon: getInstructionIcon(step.text),
                    }));
                    setInstructions(steps);
                })
                .addTo(mapRef.current);
        } else if (latLngs.length === 1) {
            mapRef.current.setView(latLngs[0], 13);
        }
    }, [points]);

    const translateInstruction = (text) => {
        const translations = {
            'Head north on': 'Dirigez-vous vers le nord sur',
            'Turn right onto': 'Tournez à droite sur',
        };
        let result = text;
        Object.keys(translations).forEach((key) => {
            if (result.includes(key)) {
                result = result.replace(key, translations[key]);
            }
        });
        return result;
    };

    const getInstructionIcon = (text) => {
        if (text.includes('Turn right')) return <FaArrowRight color="blue" size={20} />;
        if (text.includes('Turn left')) return <FaArrowLeft color="blue" size={20} />;
        if (text.includes('Continue straight')) return <FaArrowUp color="blue" size={20} />;
        if (text.includes('Enter the traffic circle')) return <FaSyncAlt color="blue" size={20} />;
        if (text.includes('You have arrived')) return <FaFlagCheckered color="green" size={20} />;
        return null;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div id="map" style={{ height: '500px', width: '70%' }} />
            <div
                className="instructions"
                style={{
                    height: '500px',
                    width: '30%',
                    backgroundColor: 'white',
                    overflowY: 'auto',
                    padding: '10px',
                    border: '1px solid #ddd',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h3 style={{ textAlign: 'left', fontSize: '18px', marginBottom: '10px' }}>
                    Instructions de navigation :
                </h3>
                <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                    {instructions.map((instruction, index) => (
                        <li key={index} style={{ padding: '10px', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                            <div style={{ marginRight: '10px' }}>{instruction.icon}</div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ color: 'black' }}>{instruction.text}</span>
                                <span style={{ color: 'gray', fontSize: '14px' }}>
                                    {instruction.distance.toFixed(0)} m
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default dynamic(() => Promise.resolve(Map), { ssr: false });
