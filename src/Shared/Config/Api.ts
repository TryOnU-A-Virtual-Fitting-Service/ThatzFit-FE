export const BASE_URL =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_DEV_SERVER
    : import.meta.env.VITE_PROD_SERVER;
