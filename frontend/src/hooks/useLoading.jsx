import { useState } from "react";

export const useLoading = () => {
  const [loading, setLoading] = useState(false);

  return {
    loading,
    setLoading, // Expose setLoading directly
    startLoading: () => setLoading(true),
    stopLoading: () => setLoading(false),
  };
};
