import { createSlice } from "@reduxjs/toolkit";
import { default as Cookies } from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get("token");

const initialState = {
  user: null,
  isAuthenticate: !!token,
  loading: false,
  isVerfied: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authRequest(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action) {
      state.user = action.payload;
      state.isAuthenticate = true;
      state.isVerfied = action.payload.isVerfied;
      state.loading = false;
    },
    verifyOtpSuccess(state) {
      state.isVerfied = true;
      if (state.user) {
        state.user.isVerfied = true;
      }
    },
    authFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    logout(state) {
      cookies.remove("token");
      state.user = null;
      state.isAuthenticate = false;
      state.isVerfied = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  authRequest,
  authSuccess,
  verifyOtpSuccess,
  authFailure,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
