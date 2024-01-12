import { Route, Routes } from 'react-router-dom';
import { TheMindPage } from './pages/the-mind.page';
import { HomePage } from './pages/home.page';
import { GAMES_GLOSSARY } from './constants';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path={`${GAMES_GLOSSARY.TheMind.path}/:roomID`}
        element={<TheMindPage game={GAMES_GLOSSARY.TheMind} />}
      />
    </Routes>
  );
}
