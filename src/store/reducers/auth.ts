import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateType {
  isAuthenticated: boolean;
  user: object | null | string | number;
  loading: boolean;
}

const initialState: initialStateType = {
  isAuthenticated: false,
  user: null,
  loading: false,
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleLog(state) {
      state.isAuthenticated = !state.isAuthenticated;
    },
    handleLogin(state) {
      state.isAuthenticated = true;
    },
    handleSearch(state, action: PayloadAction<object | number | string>) {
      state.user = action.payload;
    },
    handleLogout(state) {
      state.isAuthenticated = false;
    },
  },
});

export const { handleLogin, handleLogout, handleSearch, handleLog } =
  authReducer.actions;
export default authReducer.reducer;
