import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

const establishmentsSlice = createSlice({
  name: 'establishments',
  initialState,
  reducers: {
    getEstablisments: (state, action) => {
      state.value = action.payload ;
      console.log('establisments acquired', action.payload);
    },
  },
});

export const { getEstablisments } = establishmentsSlice.actions;
export default establishmentsSlice.reducer;
