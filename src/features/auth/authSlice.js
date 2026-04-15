import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Check localStorage so sessions persist across browser refreshes
  isAuthenticated: localStorage.getItem('aura_auth_token') ? true : false,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem('aura_auth_token', 'mock_token_xyz123');
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('aura_auth_token');
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
