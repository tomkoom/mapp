import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./_store";

interface UserState {
  balance: string;
  balance_e8s: number;
}

const initialState: UserState = {
  balance: "",
  balance_e8s: 0,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserBalance(state, { payload }: PayloadAction<string>) {
      state.balance = payload;
    },
    setUserBalanceE8S(state, { payload }: PayloadAction<number>) {
      state.balance_e8s = payload;
    },
  },
});

const selectUserBalance = (state: RootState) => state.user.balance;
const selectUserBalanceE8S = (state: RootState) => state.user.balance_e8s;
export { selectUserBalance, selectUserBalanceE8S };

export const { setUserBalance, setUserBalanceE8S } = user.actions;
export default user.reducer;
