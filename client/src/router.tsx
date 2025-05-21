import { Route, Routes } from 'react-router-dom';
import { TicTacToeClient, TheMindClient } from 'games';
import { GamePage } from 'pages/game.page';
import { HomePage } from 'pages/home.page';
import { GAMES_GLOSSARY } from 'config/games';
import { LoveLettersClient } from 'games/love-letters';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/**
       * Game Routes
       * For whatever reason, we cant componentize these. Yes, sigh...
       */}
      <Route
        path={`${GAMES_GLOSSARY.TicTacToe.path}/:matchID`}
        element={
          <GamePage
            gameConfig={GAMES_GLOSSARY.TicTacToe}
            GameClientComponent={TicTacToeClient}
          />
        }
      />
      <Route
        path={`${GAMES_GLOSSARY.TheMind.path}/:matchID`}
        element={
          <GamePage
            gameConfig={GAMES_GLOSSARY.TheMind}
            GameClientComponent={TheMindClient}
          />
        }
      />
      <Route
        path={`${GAMES_GLOSSARY.LoveLetters.path}/:matchID`}
        element={
          <GamePage
            gameConfig={GAMES_GLOSSARY.LoveLetters}
            GameClientComponent={LoveLettersClient}
          />
        }
      />
    </Routes>
  );
}
