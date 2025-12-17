import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  unreadCount: 0,
};

const notifications = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload;
      state.unreadCount = state.items.filter(n => !n.read).length;
    },
    markAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.items.find(n => n._id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: state => {
      state.items.forEach(n => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
  },
});

export const { setNotifications, markAsRead, markAllAsRead } = notifications.actions;
export default notifications.reducer;
