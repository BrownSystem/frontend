import axios from "axios";
import { useLoaderStore } from "../../store/useLoader";

const instance = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api/",
  baseURL: import.meta.env.VITE_API_URL || "https://api.bosquesrl.com/",
});

// Interceptor de request
instance.interceptors.request.use(
  (config) => {
    const { showLoader } = useLoaderStore.getState();

    // ⚡ Si no está deshabilitado explícitamente, mostrar loader
    if (!config.disableLoader) {
      showLoader();
    }

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    const { hideLoader } = useLoaderStore.getState();
    hideLoader();
    return Promise.reject(error);
  }
);

// Interceptor de response
instance.interceptors.response.use(
  (response) => {
    const { hideLoader } = useLoaderStore.getState();

    // ⚡ Si no se deshabilitó, ocultar loader
    if (!response.config.disableLoader) {
      hideLoader();
    }

    if ([401, 402, 404].includes(response?.status)) {
      window.location.href = "/";
    }

    return response;
  },
  (error) => {
    const { hideLoader } = useLoaderStore.getState();

    // ⚡ Verificar también acá por si hay error en request con loader desactivado
    if (!error.config?.disableLoader) {
      hideLoader();
    }

    if (error.response?.status === 401) {
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default instance;
