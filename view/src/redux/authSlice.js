import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('authUser')) || null,
  token: JSON.parse(localStorage.getItem('authToken')) || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem('authUser', JSON.stringify(user));
      localStorage.setItem('authToken', JSON.stringify(token));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('authUser');
      localStorage.removeItem('authToken');
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;