import { Suspense } from 'react';
import { type RouteObject } from 'react-router-dom';

import { FittingPage, FittingResultPage } from '@/Pages/Plugin';

export const pluginRoutes: RouteObject = {
  children: [
    {
      path: 'fitting',
      element: (
        // 플러그인 로딩 시 비활성화 되어 있음 로딩뷰 필요x
        <Suspense fallback={<></>}>
          <FittingPage />,
        </Suspense>
      ),
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
