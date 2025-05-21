import { GameConfig } from 'types';

export const GAMES_GLOSSARY: Record<string, GameConfig> = {
  TicTacToe: {
    id: 'TicTacToe',
    title: 'Tic-Tac-Toe',
    description: 'Exes and Ohs.',
    path: '/tictactoe',
    thumbnail:
      'https://rltoyprbcdzvrivtojcc.supabase.co/storage/v1/object/public/assets/fun-hub/tictactoe.jpeg',
    minPlayers: 2,
    maxPlayers: 2,
  },
  TheMind: {
    id: 'TheMind',
    title: 'The Mind',
    description:
      'Meld minds with your fellow players to play cards in order without talking.',
    path: '/themind',
    thumbnail:
      'https://rltoyprbcdzvrivtojcc.supabase.co/storage/v1/object/public/assets/fun-hub/themind.jpeg',
    minPlayers: 2,
    maxPlayers: 10,
  },
  LoveLetters: {
    id: 'LoveLetters',
    title: 'Love Letters',
    description:
      'Meld minds with your fellow players to play cards in order without talking.',
    path: '/loveletters',
    thumbnail:
      'https://rltoyprbcdzvrivtojcc.supabase.co/storage/v1/object/public/assets/fun-hub/themind.jpeg',
    minPlayers: 2,
    maxPlayers: 4,
  },
};
