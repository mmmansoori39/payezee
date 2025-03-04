import { createSlice } from "@reduxjs/toolkit";
import { commonSliceName } from "../../utils/constants";
import { getUserFromLocalStorage } from "../../utils/common";

const userData = getUserFromLocalStorage();

const initialState = {
  isLoggedIn: !!userData.token,
  authToken: userData.token,
  merchants: [],
  deposits: [],
  cashouts: [],
  loading: false,
  user: { name: userData.name, email: userData.email, picture: userData.picture, type: userData.type },
  cityStatusData: {}
};

export const commonSlice = createSlice({
  name: commonSliceName,
  initialState: initialState,
  reducers: {
    setMerchants: (state, action) => {
      state.merchants = action.payload;
    },
    setDeposits: (state, action) => {
      state.deposits = action.payload;
    },
    setCashouts: (state, action) => {
      state.cashouts = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.authToken = action.payload.authToken;
      state.user = action.payload.user;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setCityStatusData: (state, action) => {
      state.cityStatusData = action.payload;
    }
  }
});

export const { setIsLoggedIn, setMerchants, setDeposits, setCashouts, setLoading, setUser, setCityStatusData } =
  commonSlice.actions;

export default commonSlice.reducer;
