import NProgress from "nprogress";
import { useEffect } from "react";

export function useNProgress(isPending: boolean) {
  useEffect(() => {
    if (isPending) NProgress.start();
    else NProgress.done();
    return () => {
      NProgress.done();
    };
  }, [isPending]);
}
