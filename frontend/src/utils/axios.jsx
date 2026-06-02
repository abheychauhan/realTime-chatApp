import axios from "axios";

const instance = axios.create({
  // baseURL: "https://realtime-chatapp-u34e.onrender.com/api",
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


instance.interceptors.response.use(
  (response) => response, // normal response
  (error) => {
    if (error.response.status === 401) {
      // Token expired / invalid
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      alert("Session expired. Please login again.");
      window.location.href = "/"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default instance;
