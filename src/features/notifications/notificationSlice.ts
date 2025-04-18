import { createSlice } from '@reduxjs/toolkit';
import {
  fetchNotifications,
  fetchNotificationCount,
  markNotificationsAsRead
} from './notificationApi';
import { NotificationI } from '../../helpers/interfaces';

interface NotificationState {
    notifications: NotificationI[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
  }

  

const initialState:NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      .addCase(fetchNotificationCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.count;
      })
      .addCase(markNotificationsAsRead.fulfilled, (state) => {
        state.unreadCount = 0;
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
      });
  }
});

export default notificationSlice.reducer;
