import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { id: null, firstName: null, role: null, token: null },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { id, firstName, role, token } = action.payload;
      state.value = { id, firstName, role, token };
      console.log('user:', state.value.firstName, 'logged');
    },
    logout: state => {
      state.value = { id: null, firstName: null, role: null, token: null };
      console.log('user logged out');
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
