import axios from "axios";

const instance = axios.create({
  baseURL: "https://realtime-chatapp-799u.onrender.com/api",
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
