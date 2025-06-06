import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlide';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});