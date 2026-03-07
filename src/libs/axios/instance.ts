import { endpoint } from "@/config/endpoint";
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";
import { API_URL } from "../../config/env";
import { updateSession } from "./session-updater";

const headers = {
  "Content-Type": "application/json",
};

const api = axios.create({
  baseURL: API_URL,
  headers,
  timeout: 150 * 1000,
  withCredentials: true,
});

let refreshPromise: Promise<string | null> | null = null;

function getAuthHeader(config: InternalAxiosRequestConfig) {
  const hdr = config.headers as Record<string, unknown> & { get?: (name: string) => string | undefined };
  if (typeof hdr?.get === "function") return hdr.get("Authorization");
  return (hdr?.Authorization ?? hdr?.authorization) as string | undefined;
}

function setAuthHeader(config: InternalAxiosRequestConfig, accessToken: string) {
  const value = "Bearer " + accessToken;
  const hdr = config.headers as Record<string, unknown> & { set?: (name: string, value: string) => void };
  if (typeof hdr?.set === "function") {
    hdr.set("Authorization", value);
    return;
  }
  (config.headers as Record<string, unknown>).Authorization = value;
}

function isRefreshAuthError(error: unknown) {
  if (!axios.isAxiosError(error)) return false;
  return error.response?.status === 401 || error.response?.status === 403;
}

function isTransientRefreshError(error: unknown) {
  if (!axios.isAxiosError(error)) return false;
  if (!error.response) return true;
  return ["ECONNABORTED", "ETIMEDOUT", "ERR_NETWORK"].includes(error.code ?? "");
}

async function safeUpdateSession(accessToken: string) {
  try {
    await updateSession({ accessToken });
  } catch (error) {
    // Session bridge can be unavailable during app bootstrap. Keep request flow alive.
    console.warn(
      "Failed to sync refreshed access token to session:",
      error instanceof Error ? error.message : String(error),
    );
  }
}

async function getRefreshedAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = axios({
    url: API_URL + endpoint.AUTH + "/refresh",
    method: "POST",
    withCredentials: true,
  })
    .then(res => (res.data?.data?.accessToken as string | undefined) ?? null)
    .catch(error => {
      if (isRefreshAuthError(error)) return null;
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

api.interceptors.request.use(
  async config => {
    const session = await getSession();
    if (session?.accessToken) setAuthHeader(config, session.accessToken);
    return config;
  },
  error => Promise.reject(error),
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
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (!original) return Promise.reject(error);
    if (error.response?.status === 401 && !original._retry && getAuthHeader(original)) {
      original._retry = true;
      try {
        const accessToken = await getRefreshedAccessToken();
        if (!accessToken) {
          await signOut({ redirect: true, callbackUrl: "/auth/login" });
          return Promise.reject(error);
        }

        setAuthHeader(original, accessToken);
        await safeUpdateSession(accessToken);
        return api(original);
      } catch (refreshError) {
        if (isTransientRefreshError(refreshError)) {
          // Don't force logout on temporary network timeout/failure.
          return Promise.reject(error);
        }

        await signOut({ redirect: true, callbackUrl: "/auth/login" });
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
