import axios from "axios";
import { API_URL } from "../../config/env";

const headers = {
  "Content-Type": "application/json",
};

const api = axios.create({
  baseURL: API_URL,
  headers,
  timeout: 60 * 1000,
});

export default api;
