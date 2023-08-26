import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./_store";

interface MapState {
  isLoaded: boolean;
  map: google.maps.Map;
  position: google.maps.LatLngLiteral | null;
}

const initialState: MapState = {
  isLoaded: false,
  map: null,
  position: null,
};

const map = createSlice({
  name: "map",
  initialState,
  reducers: {
    setMapIsLoaded(state, { payload }: PayloadAction<boolean>) {
      state.isLoaded = payload;
    },
    setMap(state, { payload }: PayloadAction<google.maps.Map | null>) {
      state.map = payload;
    },
    setMapPosition(
      state,
      { payload }: PayloadAction<google.maps.LatLngLiteral>,
    ) {
      state.position = payload;
    },
  },
});

const selectMapIsLoaded = (state: RootState) => state.map.isLoaded;
const selectMap = (state: RootState) => state.map.map;
const selectMapPosition = (state: RootState) => state.map.position;
export { selectMapIsLoaded, selectMap, selectMapPosition };

export const { setMapIsLoaded, setMap, setMapPosition } = map.actions;
export default map.reducer;
