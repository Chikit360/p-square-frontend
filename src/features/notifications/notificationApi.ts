import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async () => {
    const res = await axiosInstance.get('/notifications');
    console.log(res.data.data)
    return res.data.data;
  }
);

export const fetchNotificationCount = createAsyncThunk(
  'notifications/fetchCount',
  async () => {
    const res = await axiosInstance.get('/notifications/count');
    return res.data.data;
  }
);

export const markNotificationsAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async () => {
    await axiosInstance.put('/notifications/mark-all-read');
  }
);
