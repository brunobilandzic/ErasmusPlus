import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  loggedIn: false,
  user: null,
};

export const authSlice = createSlice({
  name: "authState",
  initialState: initialUserState,
  reducers: {
    // methods to change state
    login: (state, action) => {
      state.loggedIn = true;
      state.user = action.payload;
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.loggedIn = false;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

// methods to change state
// accessed in comoonents with useDispatch

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;

// Part of store
// Mnanaging global AUTH state with redux
// Part of globally tracked state
// Imported and assembled in ../store.js
