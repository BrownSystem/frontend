import React from "react";
import { useLoaderStore } from "./useLoader";

const GlobalLoader = () => {
  const { isLoading } = useLoaderStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[999999]">
      <div className="w-16 h-16 border-4 border-[var(--brown-dark-800)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default GlobalLoader;
