import axios from "axios";

const $axios = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000,
});

$axios.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default $axios;
