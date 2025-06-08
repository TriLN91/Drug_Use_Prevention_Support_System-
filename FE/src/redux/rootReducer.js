import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./features/userSlide";

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
