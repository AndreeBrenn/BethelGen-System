import { useState } from "react";

export const useLoading = () => {
  const [loading, setLoading] = useState(false);

  const withLoading = async (callback) => {
    setLoading(true);
    try {
      await callback();
    } catch (error) {
      throw error; // Re-throw so caller can handle
    } finally {
      setLoading(false);
    }
  };

  return { loading, withLoading };
};
