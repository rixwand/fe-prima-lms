import { getErrorMessage } from "@/libs/axios/error";
import { authService } from "@/services/auth.service";
import { AppAxiosError } from "@/types/axios";
import { NextAuthOptions, User } from "next-auth";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";

const config: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      id: "token",
      name: "token",
      credentials: {
        accessToken: { label: "accessToken", type: "text" },
      },
      async authorize(creds) {
        try {
          if (!creds?.accessToken) return null;
          const res = await authService.getProfileWithToken(creds.accessToken);
          const userRes: IGetUser = res.data;
          if (!userRes) return null;
          const user: User = {
            id: userRes.id.toString(),
            accessToken: creds.accessToken,
            role: userRes.role.name,
            email: userRes.email,
            image: userRes.profilePict,
            name: userRes.username,
            fullName: userRes.fullName,
          };
          if (!user) return null;
          return user;
        } catch (error) {
          const err = error as AppAxiosError;
          console.log(getErrorMessage(err));
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.uid = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.fullName = user.fullName;
      }
      if (trigger == "update" && session.accessToken) {
        token.accessToken = session.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...(session.user ?? {}),
        id: token.uid,
        role: token.role,
        fullName: token.fullName,
      };
      session.accessToken = token.accessToken;

      return session;
    },
  },
};

export default NextAuth(config);
