import { useCallback, useEffect, useRef, useState } from "react";

export function useStickySentinel(rootRef?: React.RefObject<HTMLElement | null>, topOffsetPx = 0) {
  const sentinelNodeRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [stuck, setStuck] = useState(false);

  // callback ref — React calls this the moment the node mounts/unmounts
  const setSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      // detach old observer if exists
      if (observerRef.current && sentinelNodeRef.current) {
        observerRef.current.unobserve(sentinelNodeRef.current);
      }

      sentinelNodeRef.current = node;

      // if node is null (unmounted), cleanup & exit
      if (!node) {
        setStuck(false);
        return;
      }

      // create new observer when the element becomes available
      const observer = new IntersectionObserver(
        entries => {
          const entry = entries[0];
          setStuck(!entry.isIntersecting);
        },
        {
          root: rootRef?.current ?? null,
          threshold: 0,
          rootMargin: `-${topOffsetPx}px 0px 0px 0px`,
        }
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [rootRef, topOffsetPx]
  );

  // cleanup when hook unmounts
  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return { setSentinelRef, stuck };
}
