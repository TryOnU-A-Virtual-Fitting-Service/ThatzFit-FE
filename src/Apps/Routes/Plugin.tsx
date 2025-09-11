import { type RouteObject } from 'react-router-dom';

import { FittingPage } from '@/Pages/Plugin';
import { FittingResultPage } from '@/Pages/Plugin/Ui';

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
  ],
};
