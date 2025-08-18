import type { KyInstance, Options } from 'ky';
import ky from 'ky';

import { BASE_URL, createCustomError } from '../../Config';
import type { KySuccess, SuccessResponse } from '../../Type';

import { covertToKyMethod } from './Ky.util';

const api: KyInstance = ky.create({
  prefixUrl: BASE_URL,
  retry: 0,
  timeout: 10000,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },

  hooks: {
    beforeRequest: [],
    beforeRetry: [],
    afterResponse: [],
  },
});

const fetch = async <T = unknown>({
  method,
  url,
  options,
}: {
  method: Request['method'];
  url: string;
  options?: Options;
}): Promise<KySuccess<T>> => {
  const httpMethod = covertToKyMethod(method);

  try {
    return (await api[httpMethod])<SuccessResponse<T>>(url, options);
  } catch (error: unknown) {
    throw await createCustomError(error);
  }
};

type FetchParams = {
  url: string;
  options?: Options;
};

export const get = async <T = unknown>({ url, options }: FetchParams) => {
  return fetch<T>({ method: 'get', url, options });
};

export const post = async <T = unknown>({ url, options }: FetchParams) => {
  return fetch<T>({ method: 'post', url, options });
};

export const put = async <T = unknown>({ url, options }: FetchParams) => {
  return fetch<T>({ method: 'put', url, options });
};

export const patch = async <T = unknown>({ url, options }: FetchParams) => {
  return fetch<T>({ method: 'patch', url, options });
};

export const del = async <T = unknown>({ url, options }: FetchParams) => {
  return fetch<T>({ method: 'delete', url, options });
};
