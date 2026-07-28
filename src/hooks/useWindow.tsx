"use client";
import { useSyncExternalStore } from "react";

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener("resize", onStoreChange);
  return () => {
    window.removeEventListener("resize", onStoreChange);
  };
};

const getSnapshot = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

// The server has no viewport; 0 marks the pre-measurement state so consumers
// can hold off rendering until hydration produces a real width.
const getServerSnapshot = () => 0;

const useWindow = () => {
  const width = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    width,
    isDesktop: width >= 1024,
    loading: width === 0,
  };
};

export default useWindow;
