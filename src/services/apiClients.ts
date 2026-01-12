import axios, {
  AxiosRequestConfig,
  AxiosError,
  AxiosInstance,
  AxiosResponse,
} from "axios";
import persistStore from "redux-persist/es/persistStore";
import { configs, LocalStorageName, STRING } from "../shared";
import { store } from "../store";

export const getSubdomain = (): string | null => {
  const hostname = window.location.hostname || "";
  const subdomain = hostname?.split(".")[0];

  if (subdomain === "localhost") return "gc";
  else return subdomain;
};

// Global flags and queue

let isRefreshing = false;
// let isLoggingOut = false;

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue?.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
  });
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const storedRefreshToken = localStorage.getItem(
    LocalStorageName.RefreshToken
  );
  if (!storedRefreshToken) {
    throw new Error("No refresh token available");
  }

  const res = await axios.post(
    `${configs.USER_BASE_URL}api/users/refresh-token`,
    {
      refreshToken: storedRefreshToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Subdomain: getSubdomain(),
        Authorization: `Bearer ${storedRefreshToken}`,
      },
    }
  );

  const { jwtToken, token, refreshToken } = res.data;
  const accessToken = jwtToken || token;
  if (!accessToken) throw new Error("Invalid refresh response");

  // Save new tokens
  localStorage.setItem(LocalStorageName.Token, accessToken);
  if (refreshToken)
    localStorage.setItem(LocalStorageName.RefreshToken, refreshToken);

  return accessToken;
};

// Base Axios Clients
// Axios Instance
export const axiosClient = axios.create({
  baseURL: configs.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Subdomain: getSubdomain(),
  },
});

// Request Interceptor
const applyRequestInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config) => {
      config.headers = config.headers || {};
      const token = localStorage.getItem(LocalStorageName.Token);
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error: unknown) => Promise.reject(error)
  );
};

// Response Interceptor Handler
const setupResponseInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (err: AxiosError) => {
      const originalRequest: any = err.config;
      const status = err.response?.status;
      const data: any = err.response?.data;
      const message = data?.error || "";

      // Case: deleted or disabled user
      if (status === 401 && message === "Unauthorized") {
        return Promise.reject(err);
      }

      // Case: Access token expired
      if (
        status === 401 &&
        !originalRequest?._retry &&
        !originalRequest?.url?.includes("/users/refresh-token") &&
        message?.includes(STRING?.errorMessage?.tokenExpireError)
      ) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem(
          LocalStorageName.RefreshToken
        );

        if (!refreshToken) {
          persistStore(store).purge();
          localStorage.clear();
          window.location.reload();
          return Promise.reject(err);
        }

        if (isRefreshing) {
          // Queue requests until token is refreshed
          return new Promise((resolve, reject) => {
            failedQueue?.push({
              resolve: (token: string) => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                resolve(client(originalRequest));
              },
              reject: (error: unknown) => reject(error),
            });
          });
        }

        isRefreshing = true;

        try {
          const newAccessToken = await refreshAccessToken();
          processQueue(null, newAccessToken);
          localStorage.setItem(LocalStorageName.Token, newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          console.error("Error refreshing token ===", refreshError);
          persistStore(store).purge();
          localStorage.clear();
          window.location.reload();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Handle network errors gracefully
      if (err?.code === "ERR_NETWORK" || err?.code === "ERR_CANCELED") {
        return Promise.reject(err);
      }

      return Promise.reject(err?.response?.data || err);
    }
  );
};

applyRequestInterceptor(axiosClient);

setupResponseInterceptor(axiosClient);

// Methods GET, POST,PUT, DELETE for Axios-Client
export const get = async (path: string, config?: AxiosRequestConfig) => {
  return await axiosClient
    .get(`${path}`, config)
    .then((response) => response.data);
};

export const post = async (
  path: string,
  payload?: any,
  config?: AxiosRequestConfig
) => {
  return await axiosClient
    .post(`${path}`, payload, config)
    .then((response) => response);
};

export const put = async (
  path: string,
  payload?: any,
  config?: AxiosRequestConfig
) => {
  return await axiosClient
    .put(`${path}`, payload, config)
    .then((response) => response);
};

export const deleteRequest = async (
  path: string,
  config?: AxiosRequestConfig
) => {
  return await axiosClient
    .delete(`${path}`, config)
    .then((response) => response);
};
