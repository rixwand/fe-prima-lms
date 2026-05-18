import { SocketStatus, useSocketContext } from "@/libs/context/SocketContext";
import { useCallback, useEffect, useState } from "react";

type QueryValue = string | number | boolean | null | undefined;
type SocketPayload = unknown;
type TransportType = "websocket" | "polling";

export type UseWebSocketOptions = {
  namespace?: string;
  path?: string;
  query?: Record<string, QueryValue>;
  enabled?: boolean;
  reconnect?: boolean;
  reconnectDelayMs?: number;
  maxReconnectAttempts?: number;
  includeAuthToken?: boolean;
  authTokenKey?: string;
  transports?: TransportType[];
  onOpen?: () => void;
  onMessage?: (payload: unknown) => void;
  onClose?: (reason: string) => void;
  onError?: (error: unknown) => void;
};

export function useWebSocket({ onOpen, onMessage, onClose, onError }: UseWebSocketOptions = {}) {
  const { socket, status } = useSocketContext();
  const [lastMessage, setLastMessage] = useState<unknown>(null);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      onOpen?.();
    };

    const handleMessage = (payload: unknown) => {
      setLastMessage(payload);
      onMessage?.(payload);
    };

    const handleDisconnect = (reason: string) => {
      onClose?.(reason);
    };

    const handleConnectError = (error: unknown) => {
      onError?.(error);
    };

    socket.on("connect", handleConnect);
    socket.on("message", handleMessage);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    if (socket.connected) {
      onOpen?.();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("message", handleMessage);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [onClose, onError, onMessage, onOpen, socket]);

  const emit = useCallback((event: string, payload?: SocketPayload) => {
    if (!socket || !socket.connected) return false;
    socket.emit(event, payload);
    return true;
  }, [socket]);

  const send = useCallback(
    (payload: SocketPayload) => {
      return emit("message", payload);
    },
    [emit],
  );

  const disconnect = useCallback(() => {
    if (!socket) return;
    socket.disconnect();
  }, [socket]);

  return {
    socket,
    status: status as SocketStatus,
    isConnected: status === "open",
    lastMessage,
    emit,
    send,
    disconnect,
  };
}
