import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";
// axios.defaults.baseURL = API_URL;

export const fetchDirectMessages = async (userId, params = {}) => {
  const response = await axios.get(`/api/messages/direct/${userId}`, {
    params,
  });
  return response.data.messages;
};

export const fetchGroupMessages = async (groupId, params = {}) => {
  const response = await axios.get(`/api/messages/group/${groupId}`, {
    params,
  });
  return response.data.messages;
};

export const uploadAttachment = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post("/api/messages/attachments", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.file;
};

export const fetchWifiUsers = async () => {
  const response = await axios.get("/api/wifi/users");
  return response.data;
};

export const fetchWifiGroup = async () => {
  try {
    const response = await axios.get("/api/wifi/group");
    return response.data.wifiGroup;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const sendFriendRequest = async (payload) => {
  const response = await axios.post("/api/friends/request", payload);
  return response.data.friendRequest;
};

export const getFriendRequests = async () => {
  const response = await axios.get("/api/friends/requests");
  return response.data.requests;
};

export const respondToFriendRequest = async (requestId, action) => {
  const endpoint =
    action === "accept"
      ? `/api/friends/accept/${requestId}`
      : `/api/friends/decline/${requestId}`;
  return axios.put(endpoint);
};

export const getFriends = async () => {
  const response = await axios.get("/api/friends");
  return response.data.friends;
};

// Settings API
export const getSettings = async () => {
  const response = await axios.get("/api/settings");
  return response.data.settings;
};

export const updatePrivacySettings = async (settings) => {
  const response = await axios.put("/api/settings/privacy", settings);
  return response.data.privacySettings;
};

export const updateNotificationSettings = async (settings) => {
  const response = await axios.put("/api/settings/notifications", settings);
  return response.data.notificationSettings;
};
