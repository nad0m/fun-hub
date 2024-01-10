import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { TheMindPage } from './pages/the-mind.page';
import { HomePage } from './pages/home.page';
import { BASE_ROUTE, GAMES_GLOSSARY } from './constants';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: `${GAMES_GLOSSARY.TheMind.path}/:roomID`,
      element: <TheMindPage />,
    },
  ],
  { basename: BASE_ROUTE }
);

export function Router() {
  return <RouterProvider router={router} />;
}
