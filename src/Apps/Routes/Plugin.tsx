import type { RouteObject } from 'react-router-dom';

import { FittingPage } from '@/Pages/Plugin';

export const pluginRoutes: RouteObject = {
  path: '/fitting',
  element: <FittingPage />,
};
