import { configureStore } from '@reduxjs/toolkit';
import RootReducer from '../reducer/RootReducer';

const store = configureStore({
  reducer: RootReducer,
  devTools: process.env.REACT_APP_ENV==='development'
});

export default store;