import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

const GoogleMapsAutocomplete: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (mapRef.current && inputRef.current) {
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: -33.8688, lng: 151.2195 }, // Default to Sydney, Australia
          zoom: 13,
        });

        // Create the autocomplete object and bind it to the input field
        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current
        );
        autocompleteRef.current.bindTo("bounds", mapInstanceRef.current);

        // Set up the event listener for when the user selects a place
        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace();
          if (!place?.geometry) {
            console.log(
              "No details available for the input: '" + place?.name + "'"
            );
            return;
          }

          if (place.geometry.viewport) {
            mapInstanceRef.current?.fitBounds(place.geometry.viewport);
          } else {
            mapInstanceRef.current?.setCenter(place.geometry.location);
            mapInstanceRef.current?.setZoom(17); // Zoom to 17 if the place has no viewport
          }

          // Place a marker on the selected location
          new google.maps.Marker({
            position: place.geometry.location,
            map: mapInstanceRef.current || undefined,
          });
        });
      }
    };

    // Load Google Maps API and initialize the map
    if (window.google) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src =
        "https://maps.gomaps.pro/maps/api/js?key=AlzaSybdUIiw03QpusrW4hzG_At7S0X9VMY3d1k&libraries=geometry,places&callback=initMap";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      window.initMap = initMap;
    }
    return () => {
      // Cleanup map and autocomplete when the component unmounts
      mapInstanceRef.current = null;
      autocompleteRef.current = null;
    };
  }, []);

  return (
    <div className="pt-40">
      <input
        id="pac-input"
        ref={inputRef}
        type="text"
        placeholder="Search for a place"
        style={{
          marginTop: "10px",
          width: "300px",
          padding: "5px",
          fontSize: "14px",
        }}
      />
      <div
        id="map"
        ref={mapRef}
        style={{
          height: "400px",
          width: "100%",
        }}
      ></div>
    </div>
  );
};

export default GoogleMapsAutocomplete;
