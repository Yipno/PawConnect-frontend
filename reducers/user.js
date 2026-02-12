import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    firstName: null,
    role: null,
    token: null, //JWT token
    establishment: null,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { firstName, role, token, establishment } = action.payload;
      state.value = { firstName, role, token, establishment };
      console.log('user:', state.value.firstName, 'logged');
    },
    logout: state => {
      state.value = {
        firstName: null,
        role: null,
        token: null,
        establishment: null,
      };
      console.log('user logged out');
    },
    updateUser: (state, action) => {
      const { firstName, lastName, email, role, establishment } = action.payload;

      state.value = {
        ...state.value,
        firstName,
        lastName,
        email,
        role,
        establishment: establishment ?? state.value.establishment,
      };
      console.log('user:', state.value.firstName, 'profil mis à jour');
    },
  },
});

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
