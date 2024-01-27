// server.ts

import { TicTacToe, TheMind } from '@games';
import { Origins, Server } from 'boardgame.io/server';
import { bodyParser } from '@koa/bodyparser';

const server = Server({
  games: [TicTacToe, TheMind],
  origins: [
    // Allow localhost to connect, except when NODE_ENV is 'production'.
    Origins.LOCALHOST_IN_DEVELOPMENT,
    'https://nad0m.github.io',
  ],
});

server.router.post('/force-play', bodyParser(), async (ctx) => {
  // get body payload
  const playerID = ctx.request.body.playerID as string;
  const credentials = ctx.request.body.credentials as string;
  const matchID = ctx.request.body.matchID as string;

  if (playerID !== '0') {
    ctx.throw('Only the game leader can force start a match.', 401);
  }

  // fetch metadata
  const { state, metadata } = await ctx.db.fetch(matchID, {
    state: true,
    metadata: true,
  });

  const isAuthenticated = await ctx.auth.authenticateCredentials({
    credentials,
    playerID,
    metadata,
  });

  // throw 401 if unauthenticated
  if (!isAuthenticated || !metadata || !state) {
    ctx.throw('Invalid credentials.', 401);
  }

  // trim down players array
  const players = Object.values(metadata.players).filter((player) => !!player.name);

  // update game metadata and state
  ctx.db.setMetadata(matchID, { ...metadata, players });
  ctx.db.setState(matchID, {
    ...state,
    ctx: {
      ...state.ctx,
      numPlayers: players.length,
      playOrder: state.ctx.playOrder.slice(0, players.length),
    },
  });

  const { state: updatedState, metadata: updatedMetadata } = await ctx.db.fetch(matchID, {
    state: true,
    metadata: true,
  });

  ctx.body = {
    credentials,
    playerID,
    state: updatedState,
    metadata: updatedMetadata,
    isAuthenticated,
    success: true,
  };
});

const PORT = 8000;

server.run(PORT);
