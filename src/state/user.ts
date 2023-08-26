import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./_store";

interface UserState {
  balance: string;
}

const initialState: UserState = {
  balance: "",
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserBalance(state, { payload }: PayloadAction<string>) {
      state.balance = payload;
    },
  },
});

const selectUserBalance = (state: RootState) => state.user.balance;
export { selectUserBalance };

export const { setUserBalance } = user.actions;
export default user.reducer;
