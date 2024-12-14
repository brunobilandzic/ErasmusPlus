import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  loggedIn: false,
  user: null,
  roleRequest: null,
};

export const authSlice = createSlice({
  name: "authState",
  initialState: initialUserState,
  reducers: {
    // methods to change state
    login: (state, action) => {
      console.log(action.payload)
      state.loggedIn = true;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
      state.roleRequest = action.payload.roleRequest;
    },
    logout: (state) => {
      Object.assign(state, initialUserState);
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
