import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

const establishmentsSlice = createSlice({
  name: 'establishments',
  initialState,
  reducers: {
    getEstablishments: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { getEstablishments } = establishmentsSlice.actions;
export default establishmentsSlice.reducer;
