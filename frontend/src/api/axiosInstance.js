import axios from 'axios';

let getToken = () => null;

export const configureAuthTokenGetter = (getter) => {
  getToken = getter;
};

export const createApiClient = () => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
  });

  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
