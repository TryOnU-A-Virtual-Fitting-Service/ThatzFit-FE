import { Navigate, Outlet, type RouteObject } from 'react-router-dom';

import { RootErrorBoundary } from '../Ui';

import { pluginRoutes } from './Plugin';

export const rootRouter: RouteObject = {
  path: '',
  element: (
    <RootErrorBoundary>
      <Outlet />
    </RootErrorBoundary>
  ),
  children: [
    {
      path: '/',
      index: true,
      element: <Navigate to='/fitting' />,
    },
    pluginRoutes,
  ],
};
