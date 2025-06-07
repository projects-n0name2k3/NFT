import { useRef, useEffect } from "react";

interface MapDisplayProps {
  latitude: number | undefined;
  longitude: number | undefined;
}

const MapDisplay = ({ latitude, longitude }: MapDisplayProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  console.log(latitude, longitude);
  useEffect(() => {
    const initMap = () => {
      if (mapRef.current) {
        // Use default coordinates if none provided
        const lat = latitude || 16.0581055;
        const lng = longitude || 108.2232435;

        // Initialize the map
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 13,
        });

        // Create a marker for the location
        markerRef.current = new google.maps.Marker({
          position: { lat, lng },
          map: mapInstanceRef.current,
        });
      }
    };

    // Load Google Maps API and initialize the map
    if (window.google && window.google.maps) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.gomaps.pro/maps/api/js?key=${
        import.meta.env.VITE_MAP_API
      }&libraries=geometry,places`;
      script.async = true;
      script.defer = true;

      // Add a callback for when the script loads
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup map when the component unmounts
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      mapInstanceRef.current = null;
    };
  }, []);

  // Update marker position when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && latitude && longitude) {
      const position = { lat: latitude, lng: longitude };

      // Update map center
      mapInstanceRef.current.setCenter(position);

      // Update or create marker
      if (markerRef.current) {
        markerRef.current.setPosition(position);
      } else {
        markerRef.current = new google.maps.Marker({
          position,
          map: mapInstanceRef.current,
        });
      }
    }
  }, [latitude, longitude]);

  return <div ref={mapRef} className="w-full h-80"></div>;
};

export default MapDisplay;
