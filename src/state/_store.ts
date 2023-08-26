import { configureStore } from "@reduxjs/toolkit";

import template from "./_template";
import map from "./map";
import proposals from "./proposals";
import user from "./user";
import users from "./users";

const store = configureStore({
  reducer: { template, map, proposals, user, users },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export { store };
