import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/home.page';
import { BASE_ROUTE } from './constants';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <HomePage />,
    },
  ],
  { basename: BASE_ROUTE }
);

export function Router() {
  return <RouterProvider router={router} />;
}
