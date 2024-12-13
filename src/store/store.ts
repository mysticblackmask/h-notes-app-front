import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducers/reducer";
import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";

export const store = configureStore({ reducer });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create typed hooks for easier use
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
