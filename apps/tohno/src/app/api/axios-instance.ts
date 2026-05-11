import axios from 'axios';

function getTokenFromCookie(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AXIOS_INSTANCE = <T>(url: string, config: RequestInit = {}): Promise<T> => {
  const { method = 'GET', body, headers } = config;
  return axiosInstance({
    url,
    method,
    data: body ? JSON.parse(body as string) : undefined,
    headers: headers as Record<string, string>,
  }).then((res) => res.data);
};

export default AXIOS_INSTANCE;
