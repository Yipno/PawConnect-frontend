import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
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
      const { id, firstName, lastName, email, role, token, establishment } = action.payload;
      state.value = { id, firstName, lastName, email, role, token, establishment };
      console.log('user:', state.value.firstName, 'logged');
    },
    logout: (state) => {
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
