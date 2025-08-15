import { useEffect, useState } from "react";

function readScale() {
  // Windows 125% => ~1.25, 150% => ~1.5, normal => 1
  return typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
}

export function useEffectiveScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => setScale(Number(readScale().toFixed(2)));

    // Update on resize/moves between monitors
    window.addEventListener("resize", update);

    // Also react when devicePixelRatio changes (monitor switch / zoom)
    // VS Code/Chromium support 'change' on MediaQueryList
    let mq: MediaQueryList | null = null;
    try {
      mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      mq.addEventListener?.("change", update);
      mq.addListener?.(update); // older browsers
    } catch {}

    update();
    return () => {
      window.removeEventListener("resize", update);
      mq?.removeEventListener?.("change", update);
      mq?.removeListener?.(update);
    };
  }, []);

  return scale;
}
