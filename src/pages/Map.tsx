import { FC, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  Libraries,
} from "@react-google-maps/api";

// state
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { selectMapPosition, setMapIsLoaded } from "../state/map";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libs: Libraries = ["places"];

const Map: FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries: libs ? libs : undefined,
  });

  useEffect(() => {
    if (isLoaded) {
      dispatch(setMapIsLoaded(true));
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return <GMap />;
};

const GMap: FC = (): JSX.Element => {
  const position = useAppSelector(selectMapPosition);

  const containerStyle = {
    width: "100%",
    height: "calc(100vh - 4rem) ",
  };

  const center: google.maps.LatLngLiteral = {
    lat: 18.52043,
    lng: 73.856743,
  };

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position ? position : center}
        zoom={10}
        options={{
          zoomControl: true,
          mapTypeControl: false,
          fullscreenControl: true,
          streetViewControl: false,
          // disableDefaultUI: true,
        }}
      >
        {position && (
          <MarkerF position={position} onClick={() => console.log(position)} />
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
