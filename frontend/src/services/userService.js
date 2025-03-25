import axios from "axios";

// Get API URL from environment variables
const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5001/api"
}/users`;

const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Get profile error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch profile",
    };
  }
};

const updateUserProfile = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, userData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update profile",
    };
  }
};

const changePassword = async (passwordData) => {
  try {
    const response = await axios.put(
      `${API_URL}/change-password`,
      passwordData
    );
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to change password",
    };
  }
};

const resetPassword = async (resetData) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, resetData);
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to reset password",
    };
  }
};

export { getUserProfile, updateUserProfile, changePassword, resetPassword };
