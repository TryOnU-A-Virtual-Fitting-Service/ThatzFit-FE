const DEFAULT_PROD_SERVER = 'https://stage-thatzfit.attentionplease.build';

export const BASE_URL =
  import.meta.env.MODE === 'development'
    ? ''
    : import.meta.env.VITE_PROD_SERVER || DEFAULT_PROD_SERVER;
