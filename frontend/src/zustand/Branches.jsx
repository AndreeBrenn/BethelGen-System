import { create } from "zustand";
import usePrivateAxios from "../hooks/useProtectedAxios";
import { handleApiError } from "../utils/HandleError";
import { useEffect } from "react";

export const useBranchStore = create((set, get) => ({
  branches: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  axiosInstance: null, // Store the axios instance here

  // Set axios instance from component
  setAxiosInstance: (instance) => set({ axiosInstance: instance }),

  fetchBranches: async () => {
    const { lastFetched, branches, isLoading, axiosInstance } = get();

    if (!axiosInstance) {
      console.warn("Axios instance not set yet");
      return;
    }

    const CACHE_TIME = 5 * 60 * 1000;

    if (isLoading) return;

    if (
      branches.length > 0 &&
      lastFetched &&
      Date.now() - lastFetched < CACHE_TIME
    ) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const res = await axiosInstance.get("/branch/get-all-branch");
      set({
        branches: res.data,
        isLoading: false,
        lastFetched: Date.now(),
      });
    } catch (error) {
      handleApiError(error);
      set({ error: error.message, isLoading: false });
    }
  },
}));

// Custom hook - ONE LINE usage
export const useBranches = () => {
  const branches = useBranchStore((state) => state.branches);
  const fetchBranches = useBranchStore((state) => state.fetchBranches);
  const setAxiosInstance = useBranchStore((state) => state.setAxiosInstance);
  const axiosPrivate = usePrivateAxios(); // Use your existing hook here

  useEffect(() => {
    setAxiosInstance(axiosPrivate);
  }, [axiosPrivate, setAxiosInstance]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return branches;
};

export const getBranchName = (branches, branchID) => {
  return branches.find((branch) => branch.ID == branchID)?.Branch_name;
};
