import { FC, useState, useEffect, Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

// components
import { AutocompleteInput } from "./_index";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface CommonProps {
  selected: google.maps.LatLngLiteral | null;
}

interface MapProps extends CommonProps {
  setMapIsLoaded: Dispatch<SetStateAction<boolean>>;
}

const Map: FC<MapProps> = ({ selected, setMapIsLoaded }): JSX.Element => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (isLoaded) {
      setMapIsLoaded(true);
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return <GMap selected={selected} />;
};

const GMap: FC<CommonProps> = ({ selected }): JSX.Element => {
  const containerStyle = {
    width: "100%",
    height: "calc(100vh - 3rem) ",
  };

  const center: google.maps.LatLngLiteral = {
    lat: 18.52043,
    lng: 73.856743,
  };

  return (
    <div style={{ zIndex: "-1" }}>
      {/* <AutocompleteInput setSelected={setSelected} /> */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selected ? selected : center}
        zoom={10}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          // disableDefaultUI: true,
        }}
      >
        {selected && (
          <MarkerF position={selected} onClick={() => console.log(selected)} />
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
