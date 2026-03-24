import { configureStore } from "@reduxjs/toolkit";
import ticketReducer from "./ticket/ticketSlice";
import userReducer from "./auth/authSlice";

export const store = configureStore({
  reducer: {
    tickets: ticketReducer,
    auth: userReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;