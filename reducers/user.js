import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    role: null,
    token: null,
    establishment: null,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { id, firstName, lastName, email, role, token, establishment } = action.payload;
      state.value = { id, firstName, lastName, email, role, token, establishment };
      console.log('user:', state.value.firstName, 'logged');
    },
    logout: state => {
      state.value = {
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        role: null,
        token: null,
        establishment: null,
      };
      console.log('user logged out');
    },
    updateUser: (state, action) => {
      state.value = {
        ...state.value, // je garde tout ce qui existait
        ...action.payload, // je remplace juste ce qu’on m’a donné
      };
      console.log('user:', state.value.firstName, 'profil mis à jour');
    },
  },
});

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
