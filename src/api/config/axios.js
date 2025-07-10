import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://api.bosquesrl.com/",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("token", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
