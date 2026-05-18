import { authService } from "@/services/auth.service";
import { signOut } from "next-auth/react";

export default function useAuth() {
  const logoutHandler = async () => {
    await authService.logout();
    await signOut({
      callbackUrl: "/",
    });
  };

  return {
    logoutHandler,
  };
}
