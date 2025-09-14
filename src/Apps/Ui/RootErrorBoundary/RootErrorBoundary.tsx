import type { PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { RootErrorFallback } from '@/Pages/Plugin';

export const RootErrorBoundary = ({ children }: PropsWithChildren) => {
  return (
    <ErrorBoundary fallback={<RootErrorFallback />}>{children}</ErrorBoundary>
  );
};
