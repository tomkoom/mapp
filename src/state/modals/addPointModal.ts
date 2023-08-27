import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../_store";

interface AddPointModalState {
  isOpen: boolean;
}

const initialState: AddPointModalState = {
  isOpen: false,
};

const addPointModal = createSlice({
  name: "addPointModal",
  initialState,
  reducers: {
    setAddPointModalIsOpen(state, { payload }: PayloadAction<boolean>) {
      state.isOpen = payload;
    },
  },
});

const selectAddPointModalIsOpen = (state: RootState) =>
  state.addPointModal.isOpen;
export { selectAddPointModalIsOpen };

export const { setAddPointModalIsOpen } = addPointModal.actions;
export default addPointModal.reducer;
