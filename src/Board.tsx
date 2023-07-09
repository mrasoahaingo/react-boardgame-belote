import React from 'react';
import { BoardProps } from 'boardgame.io/react';
import { BeloteState } from './Game';

interface BeloteProps extends BoardProps<BeloteState> {}

const Appeals = ({ G, ctx, moves, playerID }: BeloteProps) => {
  const { appeals, lastAppeal: { appeal } } = G;
  const { activePlayers } = ctx;

  const hasSomeoneAppealed = Boolean(appeal);
  const playerPhase = activePlayers && playerID ? activePlayers[playerID] : null;
  const isPlayerPhaseAppeals = playerPhase === 'appeals';
  const isPlayerPhaseCanDouble = playerPhase === 'double';
  
  return (
    <>
      {isPlayerPhaseAppeals && (
        <>
          {appeals.map(appeal => (
            <button key={appeal} onClick={() => moves.appeal(appeal)}>
              {appeal}
            </button>
          ))}
          {hasSomeoneAppealed && (
            <button onClick={() => moves.pass()}>
              BONNE
            </button>
          )}
        </>
      )}
      {hasSomeoneAppealed && isPlayerPhaseCanDouble && (
        <>
          <button onClick={() => moves.double()}>
            CONTRE
          </button>
        </>
      )}
    </>
  );
};

export const Board = (boardProps: BeloteProps) => {
  const { G, ctx, moves, playerID, isActive } = boardProps;
  const { dealer, cutter, scores } = G;
  const { phase } = ctx;
  const isCutPhase = phase === 'cut';
  const isDealPhase = phase === 'firstDeal' || phase === 'lastDeal';
  const isAppealPhase = phase === 'appeals';
  const displayScore = phase === 'score';
  const isDealer = dealer === playerID;
  const isCutter = cutter === playerID;

  return (
    <main style={{ padding: 10, border: '1px solid grey', margin : 10 }}> 
      <div>scores: {scores.teamA} : {scores.teamB}</div>
      <h1 style={{ color: isActive ? 'blue' : 'grey' }}>
        {isDealer && '(D)'} Payer {playerID}{' '}
        <span>
          {isActive && isDealPhase && isDealer && (
            <button onClick={() => moves.dealCards()}>deal</button>
          )}
          {isActive && isCutPhase && isCutter && (
            <button onClick={() => moves.cutDeck()}>cut</button>
          )}
          {isAppealPhase && <Appeals {...boardProps} />}
        </span>
      </h1>
      <em>Phase: {ctx.phase}</em>
      <div>
        Hand:
        {G.hand.map((card) => (
          <button
            key={card.num+card.color}
            style={{ padding: 10, border: '1px solid grey' }}
            onClick={() => moves.playCard(card)}
          >
            {card.num}{card.color}
          </button>
        ))}
      </div>

      <div>
        Table:
        {G.table.map((card) => (
          <span
            key={card.num+card.color}
            style={{ padding: 10, border: '1px solid grey' }}
          >
            {card.num}{card.color}
          </span>
        ))}
      </div>

      {displayScore && isDealer && (
        <div>
          <button onClick={() => moves.nextParty()}>next party</button>
        </div>
      )}
    </main>
  );
};
