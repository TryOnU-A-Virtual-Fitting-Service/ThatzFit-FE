import { HTTPError, TimeoutError } from 'ky';

import type { ErrorResponse } from '../Type';

type CustomErrorConstructor = {
  code: string;
  message: string;
  validationErrors?: Record<string, string>;
};

export class CustomError extends Error implements ErrorResponse {
  public isSuccess: false = false;
  public error: ErrorResponse['error'];

  constructor(error: CustomErrorConstructor) {
    super(error.message);
    this.name = 'CustomError';
    this.error = {
      code: error.code,
      message: error.message,
      validationErrors: error.validationErrors,
    };
  }
}

export const isCustomError = (error: unknown): error is CustomError => {
  return error instanceof CustomError;
};

export const createCustomError = async (error: unknown): Promise<unknown> => {
  if (error instanceof CustomError) {
    return error;
  }

  if (error instanceof TimeoutError) {
    return new CustomError({
      code: 'TIMEOUT_ERROR',
      message: 'Request timed out',
    });
  }

  if (error instanceof HTTPError) {
    return new CustomError({
      code: error.response.status.toString(),
      message: error.message,
    });
  }

  return new CustomError({
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
  });
};
