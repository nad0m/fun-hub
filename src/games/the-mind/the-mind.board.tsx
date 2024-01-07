import React from 'react';
import { BoardProps } from 'boardgame.io/react';
import { TheMindState } from 'atom-games';

export const TheMindBoard: React.FunctionComponent<BoardProps<TheMindState>> = (props) => {
  const { phase } = props.ctx;
  const { matchData } = props;
  console.log({ props, phase });

  return (
    <div>
      <h4>Match Details</h4>
      {matchData?.map((data, id) => <div key={id}>{JSON.stringify(data)}</div>)}
    </div>
  );
};
