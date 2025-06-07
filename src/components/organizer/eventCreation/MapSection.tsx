import RequireLabel from "@/components/RequireLabel";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEventFormStore } from "@/store/event-form";
import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

const MapSection = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext(); // Access form context
  const { location, updateLocation } = useEventFormStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  useEffect(() => {
    const initMap = () => {
      if (mapRef.current && inputRef.current) {
        // Use || for default values instead of |
        const lat = location.latitude || 16.0581055;
        const lng = location.longitude || 108.2232435;

        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 13,
        });

        // Create a marker for the initial location if coordinates exist
        if (location.latitude && location.longitude) {
          new google.maps.Marker({
            position: { lat: location.latitude, lng: location.longitude },
            map: mapInstanceRef.current,
          });
        }

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

          // Update the location state
          const newLocation = {
            name: inputRef.current?.value || "",
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          };

          setValue("location.latitude", newLocation.latitude);
          setValue("location.longitude", newLocation.longitude);
          updateLocation(newLocation);

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
      script.src = `https://maps.gomaps.pro/maps/api/js?key=${
        import.meta.env.VITE_MAP_API
      }&libraries=geometry,places&callback=initMap`;
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
  }, [location.latitude, location.longitude, updateLocation, setValue]);
  return (
    <Card className="p-3 space-y-3 shadow">
      <RequireLabel label="Location" htmlFor="location" />
      <Input
        placeholder="Search for a place"
        className="w-full"
        {...register("location.name", { required: true })}
        ref={(e) => {
          // This ensures the ref works with both react-hook-form and Google Maps
          const { ref } = register("location.name", { required: true });
          if (e) {
            inputRef.current = e;
            if (typeof ref === "function") ref(e);
          }
        }}
        onChange={(e) => updateLocation({ ...location, name: e.target.value })}
      />
      {errors.location && (
        <span className="text-red-500 text-sm">
          {errors.location.message?.toString()}
        </span>
      )}
      <div id="map" ref={mapRef} className="w-full h-80"></div>
    </Card>
  );
};

export default MapSection;
