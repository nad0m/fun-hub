import { Game } from 'types';

export const BASE_ROUTE = '/fun-hub';
export const SERVER_URL = import.meta.env.VITE_ATOM_SOCKET_API;

export const POLLING_INTERVAL = 500;

export const GAMES_GLOSSARY: Record<string, Game> = {
  TicTacToe: {
    id: 'TicTacToe',
    title: 'Tic-Tac-Toe',
    description: 'Exes and Ohs.',
    path: '/tictactoe',
    thumbnail:
      'https://rltoyprbcdzvrivtojcc.supabase.co/storage/v1/object/public/assets/fun-hub/tictactoe.jpeg',
  },
  TheMind: {
    id: 'TheMind',
    title: 'The Mind',
    description: 'Meld minds with your fellow players to play cards in order without talking.',
    path: '/themind',
    thumbnail:
      'https://rltoyprbcdzvrivtojcc.supabase.co/storage/v1/object/public/assets/fun-hub/themind.jpeg',
  },
};
