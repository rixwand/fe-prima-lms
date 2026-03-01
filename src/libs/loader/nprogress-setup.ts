import NP from "nprogress";
import "nprogress/nprogress.css";

NP.configure({
  showSpinner: false,
  trickleSpeed: 700,
  minimum: 0.4,
  speed: 500,
});

export const NProgress = NP;
