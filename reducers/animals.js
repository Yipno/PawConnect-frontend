import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

const animalsSlice = createSlice({
  name: 'animals',
  initialState,
  reducers: {
    getReports: (state, action) => {
      state.value = action.payload;
      console.log('reports acquired');
    },
    updateReport: (state, action) => {
      const { id, updatedStatus, newHistory } = action.payload;

      const report = state.value.find(r => r.id === id);
      if (!report) return;

      report.status = updatedStatus;
      report.history.push(newHistory);
    },
    deleteReport: (state, action) => {
      const id = action.payload;
      state.value = state.value.filter(r => r.id !== id);
    },
  },
});

export const { getReports, updateReport } = animalsSlice.actions;
export default animalsSlice.reducer;
