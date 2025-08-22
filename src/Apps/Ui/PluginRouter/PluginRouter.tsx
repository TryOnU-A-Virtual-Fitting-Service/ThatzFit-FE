import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { rootRouter } from '@/Apps/Routes';

const router = createBrowserRouter([rootRouter]);

export const PluginRouter = () => {
  return <RouterProvider router={router} />;
};
