import { Game, Ctx } from 'boardgame.io';
import _shuffle from 'lodash.shuffle';
import { CARDS, Deck, DeckStatus, Hand, Scores, Table } from './constants';

function IsFinished(): boolean {
  return false;
}

export interface BeloteState {
  contract: string | null;
  deck: Deck;
  deckStatus: DeckStatus;
  scores: Scores;
  table: Table;
  hand: Hand;
  hands: Record<string, Hand> | null;
  turnWinner: string | null;
  dealer: string;
  cutter: string;
}

const shuffleCards = (deck: Deck): Deck => {
  return _shuffle(deck);
};

const dealCards = (G: BeloteState, ctx: Ctx, deals: number[]) => {
  const { deck: _deck, hands: _hands } = G;
  
  const deck = [..._deck];
  const orders = [...ctx.playOrder, ...ctx.playOrder];
  const first = parseInt(ctx.currentPlayer, 10) + 1;
  const dealOrder = orders.slice(first, first + 4);

  const sequence = deals
    .map((nbCards) =>
      dealOrder.map((playerId) => playerId.repeat(nbCards).split('')).flat()
    )
    .flat();
  
  const hands = sequence.reduce((hands: any, id) => {
    const playerId = `p${id}`;
    const card = {
      ...deck.shift(),
      owner: id,
    }
    return {
      ...hands,
      [playerId]: hands[playerId] ? [...hands[playerId], card] : [card]
    };
  }, _hands || {});

  return {
    hands,
    deck,
  };
};

const evaluateTable = (table: Table, scores: Scores): { turnWinner?: string, newScores?: Scores } => {
  if (table.length < 4) {
    return {};
  }

  return {
    turnWinner: '1',
    newScores: {
      teamA: scores.teamA + 10,
      teamB: scores.teamA + 1,
    },
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
    hands: null,
    turnWinner: '3',
    dealer: '2',
    cutter: '1',
  }),

  playerView: (G, ctx, id) => {
    const { hands, ...state } = G;
    const playerId = `p${id}`;
    return {
      ...state,
      hand: (hands && hands[playerId]) || []
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
        cutDeck: (G) => {
          const { deck } = G;
          const left = deck.slice(0, 16);
          const right = deck.slice(16, 32);

          const newDeck = [...right, ...left];

          return {
            ...G,
            deck: newDeck,
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
            ...dealCards(G, ctx, [3, 2]),
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
            ...dealCards(G, ctx, [3]),
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
        playCard: (G, ctx, playerCard) => {
          const { hands: _hands, deck: _deck, table: _table, scores } = G;
          const { currentPlayer } = ctx;
          
          // Remove card from player hand
          const playerId = `p${currentPlayer}`;
          const playerHand = _hands ? _hands[playerId].filter(card => card.num !== playerCard.num) : [];
          const hands = {
            ..._hands,
            [playerId]: _hands && _hands[playerId] ? playerHand : [],
          }

          // Add card to table
          const table = [..._table, playerCard];

          // Evaluate the table if winner and calculate new score
          const { turnWinner, newScores } = evaluateTable(table, scores);

          // 1. Next player
          if (!turnWinner) {
            return {
              ...G,
              table,
              hands,
            };
          }

          const playerRoles = {
            turnWinner: '1',
            dealer: '3',
            cutter: '2',
          }

          const deck = [..._deck, ...table];

          // 2. Next turn
          if (deck.length < 32) {
            ctx.events?.setPhase('play');

            return {
              ...G,
              table: [],
              deck,
              hands,
              ...playerRoles,
            }
          }

          // End of party
          return {
            table: [],
            hand: [],
            hands: null,
            deck,
            scores: newScores,
            ...playerRoles,
          };
        },
      },
      endIf: (G) => G.deck.length === 32,
      next: 'score',
    },
    /**
     * SCORE: display score
     */
    score: {
      moves: {
        nextParty: (G, ctx) => {
          ctx.events?.setPhase('cut')
        },
        newGame: (G, ctx) => {
          ctx.events?.setPhase('cut')
        },
      },
    },
  },

  endIf: (G, ctx) => {
    if (IsFinished()) {
      return { winner: ctx.currentPlayer };
    }
  },
};
