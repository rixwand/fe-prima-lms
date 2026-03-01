import { NProgress } from "@/libs/loader/nprogress-setup";
import { useEffect } from "react";
export function useNProgress(isLoading: boolean) {
  useEffect(() => {
    let startTimeout: NodeJS.Timeout;
    let doneTimeout: NodeJS.Timeout;

    if (isLoading) {
      startTimeout = setTimeout(() => {
        console.log("nprogress start");
        NProgress.start();
      }, 100); // don't show for micro fetches
    } else {
      doneTimeout = setTimeout(() => {
        console.log("nprogress done");
        NProgress.done();
      }, 200);
    }

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(doneTimeout);
    };
  }, [isLoading]);
}
