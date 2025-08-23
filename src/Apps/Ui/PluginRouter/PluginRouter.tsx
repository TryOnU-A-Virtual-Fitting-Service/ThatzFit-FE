import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { rootRouter } from '@/Apps/Routes';

const router = createMemoryRouter([rootRouter]);

export const PluginRouter = () => {
  return <RouterProvider router={router} />;
};
