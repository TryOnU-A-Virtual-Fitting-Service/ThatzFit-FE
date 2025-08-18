import type { HttpMethod } from '../../Type';

export const covertToKyMethod = (method: Request['method']) => {
  return method.toLowerCase() as HttpMethod;
};
