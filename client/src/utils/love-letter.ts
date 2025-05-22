import { CardName } from '@games';
import prince from '../assets/love-letter/prince.png';
import guard from '../assets/love-letter/guard.png';
import baron from '../assets/love-letter/baron.png';
import king from '../assets/love-letter/king.png';
import priest from '../assets/love-letter/priest.png';
import countess from '../assets/love-letter/countess.png';
import princess from '../assets/love-letter/princess.png';
import handmaid from '../assets/love-letter/handmaid.png';

const imageMap = {
  Prince: prince,
  Guard: guard,
  Baron: baron,
  King: king,
  Priest: priest,
  Countess: countess,
  Princess: princess,
  Handmaid: handmaid,
};

export const getCardImage = (cardName: CardName) => {
  return imageMap[cardName];
};
