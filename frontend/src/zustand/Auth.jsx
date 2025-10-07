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
      const res = await axios.post("/server" + "/users/login", {
        Username,
        Password,
      });
      set((state) => ({ user: (state.data = res.data) }));
    } catch (error) {
      console.log(error);
      set(() => ({ error: true, errorMessage: error }));
    } finally {
      set(() => ({ loginLoading: false }));
    }
  },
  refreshToken: async () => {
    set(() => ({ isLoading: true }));
    try {
      const res = await axios.get("/server" + "/users/refresh");

      set((state) => ({ user: (state.data = res.data) }));
      return res.data;
    } catch (error) {
      console.log(error);
      set(() => ({ error: true, errorMessage: error, user: null }));
    } finally {
      set(() => ({ isLoading: false }));
    }
  },
  logoutUser: async () => {
    await axios.get("/server" + "/users/logout");
    localStorage.removeItem("route");
    set(() => ({
      user: null,
      error: false,
      errorMessage: null,
      loginLoading: false,
    }));
  },
}));
