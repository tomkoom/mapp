import { FC, useState } from "react";
import styled from "styled-components";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

// components
import { AutocompleteInput } from "./_index";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Map: FC = (): JSX.Element => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return <GMap />;
};

const GMap: FC = (): JSX.Element => {
  const [selected, setSelected] = useState<google.maps.LatLngLiteral | null>(
    null,
  );
  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const center: google.maps.LatLngLiteral = {
    lat: 18.52043,
    lng: 73.856743,
  };

  return (
    <div>
      <AutocompleteInput setSelected={setSelected} />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selected ? selected : center}
        zoom={10}
      >
        {selected && (
          <MarkerF position={selected} onClick={() => console.log(selected)} />
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
