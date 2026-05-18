import { endpoint } from "@/config/endpoint";
import { API_URL, WS_URL } from "@/config/env";
import { updateSession } from "@/libs/axios/session-updater";
import notificationQueries from "@/queries/notification-queries";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { LuBell } from "react-icons/lu";
import { Socket, io } from "socket.io-client";

export type SocketStatus = "idle" | "connecting" | "open" | "closed" | "connecting_error";

type SocketContextType = {
  socket: Socket | null;
  status: SocketStatus;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

let refreshPromise: Promise<string | null> | null = null;

function getStatusCode(candidate: unknown) {
  if (!candidate || typeof candidate !== "object") return null;
  const value = candidate as { status?: unknown; statusCode?: unknown };
  if (typeof value.status === "number") return value.status;
  if (typeof value.statusCode === "number") return value.statusCode;
  return null;
}

function hasUnauthorizedText(candidate: unknown) {
  return typeof candidate === "string" && /(unauthorized|forbidden|401|403)/i.test(candidate);
}

function isUnauthorizedSocketError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const value = error as { message?: unknown; data?: unknown; description?: unknown };

  const statuses = [getStatusCode(value), getStatusCode(value.data), getStatusCode(value.description)];
  if (statuses.some(status => status === 401 || status === 403)) return true;

  if (hasUnauthorizedText(value.message)) return true;
  if (hasUnauthorizedText(value.data)) return true;
  if (hasUnauthorizedText(value.description)) return true;

  if (
    value.data &&
    typeof value.data === "object" &&
    hasUnauthorizedText((value.data as { message?: unknown }).message)
  ) {
    return true;
  }
  if (
    value.description &&
    typeof value.description === "object" &&
    hasUnauthorizedText((value.description as { message?: unknown }).message)
  ) {
    return true;
  }

  return false;
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

function resolveWebSocketBaseUrl() {
  return WS_URL?.trim() || "";
}

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status: authStatus } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<SocketStatus>("idle");
  const qc = useQueryClient();

  const baseUrl = useMemo(() => resolveWebSocketBaseUrl(), []);
  const token = session?.accessToken;

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!baseUrl || authStatus !== "authenticated" || !token) {
      setSocket(null);
      setStatus(prev => (prev === "idle" ? prev : "closed"));
      return;
    }

    setStatus("connecting");

    const socketInstance = io(baseUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 2500,
      reconnectionAttempts: Infinity,
      withCredentials: true,
      query: {
        accessToken: token,
      },
      auth: {
        accessToken: token,
      },
    });

    setSocket(socketInstance);

    const handleConnect = () => {
      setStatus("open");
    };

    const handleDisconnect = () => {
      setStatus("closed");
    };

    const handleConnectError = async (error: Error) => {
      setStatus("connecting_error");
      if (!isUnauthorizedSocketError(error)) return;

      try {
        const accessToken = await getRefreshedAccessToken();
        if (!accessToken) {
          await signOut({ redirect: true, callbackUrl: "/auth/login" });
          return;
        }

        const currentAuth =
          socketInstance.auth && typeof socketInstance.auth === "object"
            ? (socketInstance.auth as Record<string, unknown>)
            : {};
        socketInstance.auth = { ...currentAuth, accessToken };

        const currentQuery = socketInstance.io.opts.query;
        socketInstance.io.opts.query =
          currentQuery && typeof currentQuery === "object"
            ? { ...(currentQuery as Record<string, unknown>), accessToken }
            : { accessToken };

        await safeUpdateSession(accessToken);
        socketInstance.connect();
      } catch (refreshError) {
        if (isTransientRefreshError(refreshError)) return;
        await signOut({ redirect: true, callbackUrl: "/auth/login" });
      }
    };

    function handleNewNotification(payload: { message: string; courseId: number; requestedByUserId?: number }) {
      addToast({
        icon: <LuBell />,
        title: "Notification",
        color: "primary",
        description: payload.message,
      });
      qc.invalidateQueries({ queryKey: notificationQueries.keys.listNotifications() });
    }

    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);
    socketInstance.on("connect_error", handleConnectError);
    socketInstance.on("new_notifications", handleNewNotification);

    return () => {
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
      socketInstance.off("connect_error", handleConnectError);
      socketInstance.off("new_notifications", handleNewNotification);
      socketInstance.disconnect();
      setSocket(null);
      setStatus("closed");
    };
  }, [authStatus, baseUrl, token]);

  const value = useMemo<SocketContextType>(
    () => ({
      socket,
      status,
      isConnected: status === "open",
    }),
    [socket, status],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocketContext must be used inside SocketProvider");
  return ctx;
}
