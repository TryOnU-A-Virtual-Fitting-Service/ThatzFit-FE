import type { PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// TODO Error Fallback 정의 필요
export const RootErrorBoundary = ({ children }: PropsWithChildren) => {
  return <ErrorBoundary fallback={<div>Error</div>}>{children}</ErrorBoundary>;
};
