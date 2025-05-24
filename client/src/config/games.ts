import { GameConfig } from 'types';
import tictactoe from '../assets/app/tictactoe.jpeg';
import themind from '../assets/app/themind.jpeg';
import loveletter from '../assets/app/loveletters.webp';

export const GAMES_GLOSSARY: Record<string, GameConfig> = {
  LoveLetter: {
    id: 'LoveLetter',
    title: 'Love Letter',
    description: 'Game of risk, deduction, and luck.',
    path: '/loveletter',
    thumbnail: loveletter,
    minPlayers: 2,
    maxPlayers: 4,
    active: true,
  },
  TicTacToe: {
    id: 'TicTacToe',
    title: 'Tic-Tac-Toe',
    description: 'Exes and Ohs.',
    path: '/tictactoe',
    thumbnail: tictactoe,
    minPlayers: 2,
    maxPlayers: 2,
    active: true,
  },
  TheMind: {
    id: 'TheMind',
    title: 'The Mind',
    description:
      'Meld minds with your fellow players to play cards in order without talking.',
    path: '/themind',
    thumbnail: themind,
    minPlayers: 2,
    maxPlayers: 10,
    active: false,
  },
};
