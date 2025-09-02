import AuthLayout from "@/components/layouts/AuthLayout";
import Auth from "@/components/views/Auth";
import { AuthContext, mode as Mode } from "@/libs/context/AuthContext";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useCallback } from "react";

const ALLOWED: Record<string, Mode> = {
  login: "login",
  register: "register",
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const state = Array.isArray(params?.state) ? params!.state[0] : params?.state;
  if (!state || !ALLOWED[state]) {
    return { notFound: true };
  }
  return {
    props: { initialMode: ALLOWED[state] as Mode },
  };
};

export default function AuthPage({ initialMode }: { initialMode: Mode }) {
  const router = useRouter();
  const setMode = useCallback(
    (next: Mode) => {
      router.replace(`/auth/${next}`);
    },
    [router]
  );

  return (
    <AuthContext.Provider value={{ mode: initialMode, setMode }}>
      <AuthLayout title={`Prisma | ${initialMode === "login" ? "Masuk" : "Daftar"}`}>
        <Auth />
      </AuthLayout>
    </AuthContext.Provider>
  );
}
