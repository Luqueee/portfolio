"use client";
import { useEffect, useState } from "react";

const useWindow = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [width, setWidth] = useState<number>(0);

  const handleResize = () => {
    const screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    setWidth(screenWidth);
    setIsDesktop(screenWidth >= 1024);
    setLoading(false);
  };
  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    width,
    isDesktop,
    loading,
  };
};

export default useWindow;
