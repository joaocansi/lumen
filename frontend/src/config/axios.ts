import axios from "axios";

const axiosConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
};

export const api = axios.create(axiosConfig);
