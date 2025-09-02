import { createContext, useContext } from "react";
export type mode = "login" | "register";
type AuthContextType = {
  mode: mode;
  setMode: (mode: mode) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
