import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./_store";
import type { User } from "../declarations/backend/backend.did";

interface UsersState {
  users: User[];
}

const initialState: UsersState = {
  users: [],
};

const users = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, { payload }: PayloadAction<User[]>) {
      state.users = payload;
    },
  },
});

const selectUsers = (state: RootState) => state.users.users;
export { selectUsers };

export const { setUsers } = users.actions;
export default users.reducer;
