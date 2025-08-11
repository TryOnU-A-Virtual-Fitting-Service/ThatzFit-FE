import type { KyInstance, Options } from 'ky';
import ky from 'ky';

import { BASE_URL } from '../../Config';
import type { HttpMethod, KySuccess, SuccessResponse } from '../../Type';

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

const kyMethod = (method: Request['method']) => {
  return method.toLowerCase() as HttpMethod;
};

const fetch = async <T = unknown>({
  method,
  url,
  options,
}: {
  method: Request['method'];
  url: string;
  options?: Options;
}): Promise<KySuccess<T>> => {
  const httpMethod = kyMethod(method);
  return (await api[httpMethod])<SuccessResponse<T>>(url, options);
};

export const get = async <T = unknown>({
  url,
  options,
}: {
  url: string;
  options?: Options;
}) => {
  return fetch<T>({ method: 'get', url, options });
};

export const post = async <T = unknown>({
  url,
  options,
}: {
  url: string;
  options?: Options;
}) => {
  return fetch<T>({ method: 'post', url, options });
};

export const put = async <T = unknown>({
  url,
  options,
}: {
  url: string;
  options?: Options;
}) => {
  return fetch<T>({ method: 'put', url, options });
};

export const patch = async <T = unknown>({
  url,
  options,
}: {
  url: string;
  options?: Options;
}) => {
  return fetch<T>({ method: 'patch', url, options });
};

export const del = async <T = unknown>({
  url,
  options,
}: {
  url: string;
  options?: Options;
}) => {
  return fetch<T>({ method: 'delete', url, options });
};
