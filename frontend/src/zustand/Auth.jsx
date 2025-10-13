import { create } from "zustand";
import axios from "axios";

export const useAuth = create((set) => ({
  user: null,
  isLoading: false,
  loginLoading: false,
  error: false,
  errorMessage: null,
  loginUser: async (Username, Password) => {
    set(() => ({ loginLoading: true }));
    try {
      const res = await axios.post(
        import.meta.env.VITE_AXIOS_URL + "/users/login",
        {
          Username,
          Password,
        }
      );
      set((state) => ({ user: (state.data = res.data) }));
    } catch (error) {
      console.log(error);
      set(() => ({ error: true, errorMessage: error }));
    } finally {
      set(() => ({ loginLoading: false }));
    }
  },
  // refreshToken: async () => {
  //   set(() => ({ isLoading: true }));
  //   try {
  //     const res = await axios.get(
  //       import.meta.env.VITE_AXIOS_URL + "/users/refresh"
  //     );

  //     set((state) => ({ user: (state.data = res.data) }));
  //     return res.data;
  //   } catch (error) {
  //     console.log(error);
  //     set(() => ({ error: true, errorMessage: error, user: null }));
  //   } finally {
  //     set(() => ({ isLoading: false }));
  //   }
  // },
  refreshToken: async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_AXIOS_URL + "/users/refresh",
        { withCredentials: true }
      );
      set({ user: res.data });
      return res.data;
    } catch (error) {
      set({ user: null });
      // throw error;
    }
  },
  logoutUser: async () => {
    await axios.get(import.meta.env.VITE_AXIOS_URL + "/users/logout");
    localStorage.removeItem("route");
    set(() => ({
      user: null,
      error: false,
      errorMessage: null,
      loginLoading: false,
    }));
  },
}));
