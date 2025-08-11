import type { KyResponse } from 'ky';

type Response = {
  isSuccess: boolean;
};

export type SuccessResponse<T = unknown> = Response & {
  isSuccess: true;
  data: T;
};

export type ErrorResponse = Response & {
  isSuccess: false;
  error: {
    code: string;
    message: string;
    validationErrors?: Record<string, string>;
  };
};

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
export type KySuccess<T = unknown> = KyResponse<SuccessResponse<T>>;
