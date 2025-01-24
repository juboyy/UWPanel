import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ origin }) => {
    const mapContainer = useRef(null);
  
    useEffect(() => {
      // Inicializa o mapa
      const map = L.map(mapContainer.current).setView([-23.5505, -46.6333], 12);
  
      // Adiciona as tiles do OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);
  
      // Localiza a origem se fornecida
      if (origin) {
        fetch(
          `https://us1.locationiq.com/v1/search.php?key=pk.38bb00d34897b5abaca0fbb2adbbec0f&q=${origin}&format=json`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.length > 0) {
              const { lat, lon } = data[0];
              L.marker([lat, lon]).addTo(map);
              map.setView([lat, lon], 12);
            }
          })
          .catch((err) => console.error(err));
      }
  
      // Força o redimensionamento do mapa em telas menores
      const handleResize = () => {
        map.invalidateSize();
      };
      window.addEventListener('resize', handleResize);
  
      // Garante que o mapa ajuste o tamanho inicial
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
  
      // Limpa o mapa ao desmontar
      return () => {
        window.removeEventListener('resize', handleResize);
        map.remove();
      };
    }, [origin]);
  
    return (
      <div
        ref={mapContainer}
        className="map-container"
        style={{ width: '100%', height: '350px' }}
      />
    );
  };
  
  export default MapComponent;