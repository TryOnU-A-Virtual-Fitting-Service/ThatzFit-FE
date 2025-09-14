import { type RouteObject } from 'react-router-dom';

import { FittingPage, FittingResultPage } from '@/Pages/Plugin';

export const pluginRoutes: RouteObject = {
  children: [
    {
      path: 'fitting',
      element: <FittingPage />,
    },
    {
      path: 'fitting/result',
      element: <FittingResultPage />,
    },
    {
      path: '*',
      loader: () => {
        throw new Error();
      },
      element: <></>,
    },
  ],
};
