import axios, { AxiosRequestConfig } from 'axios';

// Replace with your friend's backend URL when ready
export const AXIOS_INSTANCE = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = axios.create({ 
    baseURL: 'https://api.example.com',
    withCredentials: true 
  });

  return source(config).then((res) => res.data);
};

export default AXIOS_INSTANCE;