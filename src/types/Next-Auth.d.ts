import { DefaultSession, DefaultUser } from "next-auth";
import "next-auth/jwt";

export type RoleName = "admin" | "lecturer" | "member" | string;

declare module "next-auth" {
  interface Session {
    accessToken?: string; // remove if you don't want token in session
    user: DefaultSession["user"] & {
      id: string;
      role: RoleName;
      fullName: string;
    };
  }

  interface User extends DefaultUser {
    id: string;
    role: RoleName;
    fullName: string;
    accessToken?: string; // remove if you don't want token in session
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid: string;
    role: RoleName;
    accessToken?: string; // remove if you don't want token in session
    // accessTokenExpires?: number;  // add if you track expiry
    fullName: string;
  }
}
