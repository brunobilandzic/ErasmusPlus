import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: { authState: authReducer },
});

export default store;

// Managing global state with redux
// Parts of a state e.g. auth are accessed in components with useSelector
