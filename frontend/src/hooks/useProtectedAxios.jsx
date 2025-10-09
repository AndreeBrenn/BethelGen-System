import React, { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../zustand/Auth";

const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_AXIOS_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
const usePrivateAxios = () => {
  const { refreshToken, user } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${user}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,

      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status == 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refreshToken();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [user, refreshToken]);

  return axiosPrivate;
};

export default usePrivateAxios;
