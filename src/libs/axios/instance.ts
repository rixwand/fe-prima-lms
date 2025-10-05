import { endpoint } from "@/config/endpoint";
import { AppAxiosError } from "@/types/axios";
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";
import { API_URL } from "../../config/env";
import { getErrorMessage } from "./error";
import { updateSession } from "./session-updater";

const headers = {
  "Content-Type": "application/json",
};

const api = axios.create({
  baseURL: API_URL,
  headers,
  timeout: 60 * 1000,
  withCredentials: true,
});

api.interceptors.request.use(
  async config => {
    const session = await getSession();
    if (session && session.accessToken) config.headers["Authorization"] = "Bearer " + session.accessToken;
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  (res: AxiosResponse) => {
    const rt = res.config?.responseType;
    if (rt === "blob" || rt === "arraybuffer" || rt === "stream") return res;
    const payload = res.data;
    if (payload !== null && typeof payload === "object" && Object.prototype.hasOwnProperty.call(payload, "data")) {
      res.data = payload.data;
    }
    return res;
  },
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry: boolean };
    if (error.response?.status == 401 && !original._retry && original.headers.Authorization) {
      original._retry = true;
      try {
        const res = await axios({
          url: API_URL + endpoint.AUTH + "/refresh",
          method: "POST",
          withCredentials: true,
        });
        const accessToken = res.data.data.accessToken as string;
        if (accessToken) {
          original.headers.Authorization = "Bearer " + accessToken;
          await updateSession({ accessToken });
          return api(original);
        } else {
          await signOut({ redirect: true, callbackUrl: "/auth/login" });
          return Promise.reject(error);
        }
      } catch (err) {
        getErrorMessage(err as AppAxiosError);
        await signOut({ redirect: true, callbackUrl: "/auth/login" });
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
