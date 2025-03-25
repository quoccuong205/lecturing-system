import axios from "axios";

// Get API URL from environment variables
const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5001/api"
}/lectures`;

// Add request interceptor to make sure token is included in requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const getLectures = async () => {
  try {
    const response = await axios.get(API_URL);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Fetch lectures error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch lectures",
    };
  }
};

const getLectureById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch lecture",
    };
  }
};

const createLecture = async (lectureData) => {
  try {
    const formData = new FormData();
    formData.append("title", lectureData.title);
    formData.append("description", lectureData.description || "");
    formData.append("video", lectureData.video);

    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create lecture",
    };
  }
};

const updateLecture = async (id, lectureData) => {
  try {
    const formData = new FormData();
    if (lectureData.title) formData.append("title", lectureData.title);
    if (lectureData.description)
      formData.append("description", lectureData.description);
    if (lectureData.video) formData.append("video", lectureData.video);

    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update lecture",
    };
  }
};

const deleteLecture = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete lecture",
    };
  }
};

export {
  getLectures,
  getLectureById,
  createLecture,
  updateLecture,
  deleteLecture,
};
