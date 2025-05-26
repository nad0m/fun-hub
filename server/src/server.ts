// server.ts

import { TicTacToe, TheMind, LoveLetter, ConnectFour } from '../../games/src';
import { Origins, Server } from 'boardgame.io/server';
import koaBody from 'koa-body';
import { bodyParser } from '@koa/bodyparser';
import { LobbyAPI, StorageAPI } from 'boardgame.io';
import { getFirstAvailablePlayerID, getNumPlayers } from './utils';
import { logJoinEvent } from './db';

const server = Server({
  games: [TicTacToe, TheMind, LoveLetter, ConnectFour],
  origins: [
    // Allow localhost to connect, except when NODE_ENV is 'production'.
    Origins.LOCALHOST_IN_DEVELOPMENT,
    'https://nad0m.github.io',
  ],
});

/**
 * Join a given match.
 *
 * @param {string} name - The name of the game.
 * @param {string} id - The ID of the match.
 * @param {string} playerID - The ID of the player who joins. If not sent, will be assigned to the first index available.
 * @param {string} playerName - The name of the player who joins.
 * @param {object} data - The default data of the player in the match.
 * @return - Player ID and credentials to use when interacting in the joined match.
 */
server.router.post('/games/:name/:id/join', koaBody(), async (ctx) => {
  let playerID = ctx.request.body.playerID;
  const playerName = ctx.request.body.playerName;
  const data = ctx.request.body.data;
  const matchID = ctx.params.id;
  const gameName = ctx.params.name;

  if (!playerName) {
    ctx.throw(403, 'playerName is required');
  }

  const { metadata } = await (server.db as StorageAPI.Async).fetch(matchID, {
    metadata: true,
  });
  if (!metadata) {
    ctx.throw(404, 'Match ' + matchID + ' not found');
  }

  if (typeof playerID === 'undefined' || playerID === null) {
    playerID = getFirstAvailablePlayerID(metadata.players);
    if (playerID === undefined) {
      const numPlayers = getNumPlayers(metadata.players);
      ctx.throw(
        409,
        `Match ${matchID} reached maximum number of players (${numPlayers})`
      );
    }
  }

  if (!metadata.players[playerID]) {
    ctx.throw(404, 'Player ' + playerID + ' not found');
  }
  if (metadata.players[playerID].name) {
    ctx.throw(409, 'Player ' + playerID + ' not available');
  }

  if (data) {
    metadata.players[playerID].data = data;
  }
  metadata.players[playerID].name = playerName;
  const playerCredentials = await server.auth.generateCredentials(ctx);
  metadata.players[playerID].credentials = playerCredentials;

  await server.db.setMetadata(matchID, metadata);

  const body: LobbyAPI.JoinedMatch = { playerID, playerCredentials };
  ctx.body = body;

  logJoinEvent({
    playerID,
    playerName,
    matchID,
    gameName,
    playerCredentials,
  }).catch((e) => {
    console.error('Error inserting log', e);
  });
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

const PORT = 8080;

server.run(PORT);
