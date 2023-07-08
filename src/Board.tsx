import React from 'react';
import { BoardProps } from 'boardgame.io/react';
import { BeloteState } from './Game';
import { Ctx } from 'boardgame.io';

const getWinner = (ctx: Ctx): string | null => {
  if (!ctx.gameover) return null;
  if (ctx.gameover.draw) return 'Draw';
  return `Player ${ctx.gameover.winner} wins!`;
};

interface BeloteProps extends BoardProps<BeloteState> {}

export const Board = ({ G, ctx, moves, playerID, isActive }: BeloteProps) => {
  const winner = getWinner(ctx);
  const { dealer, cutter } = G;
  const { phase } = ctx;
  const cutting = phase === 'cut';
  const dealing = phase === 'firstDeal' || phase === 'lastDeal';
  const talking = phase === 'talk';

  return (
    <main>
      <h1 style={{ color: isActive ? 'blue' : 'grey' }}>
        {playerID && playerID === dealer && '(D)'} Payer {playerID}{' '}
        {isActive && (
          <span>
            {dealing && dealer && (
              <button onClick={() => moves.dealCards()}>deal</button>
            )}
            {cutting && cutter && (
              <button onClick={() => moves.cutDeck()}>cut</button>
            )}
            {talking && (
              <button onClick={() => moves.talk(playerID === '0' && 'bonne')}>
                talk
              </button>
            )}
          </span>
        )}
      </h1>
      <em>Phase: {ctx.phase}</em>
      <div>
        Hand:
        {G.hand.map((card) => (
          <button
            key={card.num}
            style={{ padding: 10, border: '1px solid grey' }}
            onClick={() => moves.playCard(card)}
          >
            {card.num}
          </button>
        ))}
      </div>

      <div>
        Table:
        {G.table.map((card) => (
          <span
            key={card.num}
            style={{ padding: 10, border: '1px solid grey' }}
          >
            {card.num}
          </span>
        ))}
      </div>

      {winner && <p>{winner}</p>}
    </main>
  );
};
