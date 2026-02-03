import { setSessionUpdater } from "@/libs/axios/session-updater";
import "@/styles/globals.css";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider, useSession } from "next-auth/react";
import type { AppProps } from "next/app";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const Bridge = () => {
  const { update } = useSession();
  setSessionUpdater(update);
  return null;
};

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Bridge />
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider>
          <ToastProvider placement="top-center" toastProps={{ classNames: { base: "top-5" } }} />
          <Component {...pageProps} />
        </HeroUIProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
