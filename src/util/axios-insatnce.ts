import axios from "axios";
import { wafIntercept } from "@madie/madie-util";

export const axiosInstance = axios.create();
axiosInstance.interceptors.response.use((response) => {
  return response;
}, wafIntercept);
