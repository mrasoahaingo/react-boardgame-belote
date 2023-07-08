import { Game, Ctx } from 'boardgame.io';
import _shuffle from 'lodash.shuffle';
import { CARDS, CardStatus, Deck, DeckStatus, Hand, Table } from './constants';

function IsFinished(): boolean {
  return false;
}

export interface BeloteState {
  contract: string | null;
  deck: Deck;
  deckStatus: DeckStatus;
  scores: {
    teamA: number;
    teamB: number;
  };
  table: Table;
  hand: Hand;
  turnWinner: string | null;
  dealer: string;
  cutter: string;
}

const shuffleCards = (deck: Deck): Deck => {
  return _shuffle(deck);
};

const dealCards = (G: BeloteState, ctx: Ctx, deals: number[]) => {
  const { deck } = G;

  const orders = [...ctx.playOrder, ...ctx.playOrder];
  const first = parseInt(ctx.currentPlayer, 10) + 1;
  const dealOrder = orders.slice(first, first + 4);

  const sequence = deals
    .map((nbCards) =>
      dealOrder.map((playerId) => playerId.repeat(nbCards).split('')).flat()
    )
    .flat();

  const cards = deck.map((card, i) => ({
    ...card,
    owner: sequence[i],
    status: CardStatus.HAND,
  }));

  return cards;
};

const evaluateTable = (deck: Deck) => {
  const tableCards = deck.filter((card) => card.status === CardStatus.TABLE);

  if (tableCards.length === 4) {
    const cardsToClear = tableCards.map((card) => card.num);
    const clearedDeck = deck.map((card) => ({
      ...card,
      status: cardsToClear.includes(card.num) ? CardStatus.DECK : card.status,
    }));
    return {
      deck: clearedDeck,
      turnWinner: '1',
      scores: {
        teamA: 10,
        teamB: 2,
      },
    };
  }

  return {
    deck,
  };
};

export const Belote: Game<BeloteState> = {
  setup: () => ({
    contract: null,
    deck: shuffleCards(CARDS),
    deckStatus: DeckStatus.SHUFFLED,
    scores: { teamA: 0, teamB: 0 },
    table: [],
    hand: [],
    turnWinner: '3',
    dealer: '2',
    cutter: '1',
  }),

  playerView: (G, ctx, playerID) => {
    const { deck } = G;
    const hand = playerID
      ? deck.filter(
          (card) => card.owner === playerID && card.status === CardStatus.HAND
        ) || []
      : [];
    const table = deck.filter((card) => card.status === CardStatus.TABLE);
    return {
      ...G,
      hand,
      table,
    };
  },

  phases: {
    /**
     * CUT: le joueur avant le dealer coupe le jeu
     */
    cut: {
      turn: {
        order: {
          first: (G) => parseInt(G.cutter, 10),
          next: (G) => parseInt(G.dealer, 10),
        },
      },
      moves: {
        cutDeck: (G, ctx, card) => {
          return {
            ...G,
            deckStatus: DeckStatus.CUTTED,
          };
        },
      },
      endIf: (G) => G.deckStatus === DeckStatus.CUTTED,
      next: 'firstDeal',
      start: true,
    },
    /**
     * DEAL: le dealer partage les 5 premières cartes en commençant par le gagnant
     */
    firstDeal: {
      turn: {
        order: {
          first: (G) => parseInt(G.dealer, 10),
          next: (G) => parseInt(G.dealer, 10) + 1,
        },
      },
      moves: {
        dealCards: (G, ctx) => {
          return {
            ...G,
            deck: dealCards(G, ctx, [3, 2]),
            deckStatus: DeckStatus.DEALED,
          };
        },
      },
      endIf: (G) => G.deckStatus === DeckStatus.DEALED,
      next: 'talk',
    },
    /**
     * TALK: le gagnant fait la première annonce du jeu
     */
    talk: {
      turn: {
        maxMoves: 1,
      },
      moves: {
        talk: (G, ctx, bid) => {
          if (bid === 'bonne') {
            return {
              ...G,
              contract: 'TOUTA',
              deckStatus: DeckStatus.CONTRACT,
            };
          }
          return G;
        },
      },
      endIf: (G) => Boolean(G.contract),
      next: 'lastDeal',
    },
    /**
     * DEAL: le dealer partage les 3 dernières cartes en commençant par le gagnant
     */
    lastDeal: {
      turn: {
        order: {
          first: (G) => parseInt(G.dealer, 10),
          next: (G) => parseInt(G.dealer, 10) + 1,
        },
      },
      moves: {
        dealCards: (G, ctx) => {
          return {
            ...G,
            deck: dealCards(G, ctx, [3, 2, 3]),
            deckStatus: DeckStatus.DEALED,
          };
        },
      },
      endIf: (G) => G.deckStatus === DeckStatus.DEALED,
      next: 'play',
    },
    /**
     * PLAY: le gagnant joue la première carte
     */
    play: {
      turn: {
        maxMoves: 1,
        order: {
          first: (G) => parseInt(G.turnWinner || '0', 10),
          next: (G, ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
        },
      },
      moves: {
        playCard: (G, ctx, playedCard) => {
          const newDeck = G.deck.map((card) => ({
            ...card,
            status:
              card.num === playedCard.num ? CardStatus.TABLE : card.status,
          }));

          const { turnWinner, scores, deck } = evaluateTable(newDeck);

          if (endParty) {
            ctx.events?.setPhase('score');

            return {
              turnWinner: '3',
              dealer: '2',
              cutter: '1',
            };
          }

          if (turnWinner) {
            ctx.events?.setPhase('play');
          }

          return {
            ...G,
            deck,
            turnWinner: turnWinner ? turnWinner : G.turnWinner,
            scores: scores ? scores : G.scores,
          };
        },
      },
    },
    /**
     * SCORE: display score
     */
    score: {
      moves: {
        nextParty: () => {},
        newGame: () => {},
      },
    },
  },

  endIf: (G, ctx) => {
    if (IsFinished()) {
      return { winner: ctx.currentPlayer };
    }
  },
};
