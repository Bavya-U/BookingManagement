import React from "react";
import { useSelector } from "react-redux";

export const Loader = () => {
  const isLoading = useSelector(
    (state) =>
      state?.auth?.loading ||
      state?.booking?.loading ||
      state?.slots?.loading ||
      state?.services?.loading ||
      state?.allbooking?.loading
  );

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="flex space-x-3">
        <span className="w-5 h-5 bg-[#2798b5] rounded-full animate-bounce shadow-md"></span>
        <span className="w-5 h-5 bg-[#2798b5] rounded-full animate-bounce shadow-md delay-200"></span>
        <span className="w-5 h-5 bg-[#2798b5] rounded-full animate-bounce shadow-md delay-400"></span>
      </div>
    </div>
  );
};
