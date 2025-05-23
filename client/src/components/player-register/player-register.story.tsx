import { PlayerRegister } from './player-register';

export default {
  title: 'PlayerRegister',
};

export const Default = ({ gameTitle }: { gameTitle: string }) => (
  <PlayerRegister gameTitle={gameTitle} />
);
