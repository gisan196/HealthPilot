import axios from "axios";
import { API_BASE_URL } from "./api";

const API_URL = `${API_BASE_URL}/notifications`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* ===== Get all notifications ===== */
export const getNotifications = async () => {
  const res = await axios.get(API_URL, getAuthHeader());
  return res.data;
};

/* ===== Get unread notifications count ===== */
export const getUnreadCount = async () => {
  const res = await axios.get(`${API_URL}/unread-count`, getAuthHeader());
  return res.data;
};

/* ===== Mark all notifications as read ===== */
export const markNotificationsRead = async () => {
  const res = await axios.post(`${API_URL}/mark-read`, {}, getAuthHeader());
  return res.data;
};

/* ===== Create a new notification ===== */
export const createNotification = async (message) => {
  const res = await axios.post(
    API_URL,
    { message},
    getAuthHeader()
  );
  return res.data;
};
