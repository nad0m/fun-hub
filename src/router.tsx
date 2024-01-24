import { Route, Routes } from 'react-router-dom';
import { TheMindClient } from 'games';
import { GamePage } from 'pages/game.page';
import { HomePage } from 'pages/home.page';
import { GAMES_GLOSSARY } from 'config/games';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/**
       * Game Routes
       * For whatever reason, we cant componentize these. Yes, sigh...
       */}
      <Route
        path={`${GAMES_GLOSSARY.TheMind.path}/:matchID`}
        element={
          <GamePage
            gameConfig={GAMES_GLOSSARY.TheMind}
            GameClientComponent={TheMindClient}
          />
        }
      />
    </Routes>
  );
}
