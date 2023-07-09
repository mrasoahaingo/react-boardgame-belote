import { Game, Ctx } from 'boardgame.io';
import _shuffle from 'lodash.shuffle';
import { Appeals, APPEAL_ORDER, CARDS, Contract, Deck, Hand, Scores, Table } from './constants';

function IsFinished(): boolean {
  return false;
}

export interface BeloteState {
  contract: Contract;
  deck: Deck;
  scores: Scores;
  table: Table;
  hand: Hand;
  hands: Record<string, Hand> | null;
  firstPlayer: string;
  dealer: string;
  cutter: string;
  lastAppeal: Contract;
  appeals: Appeals[];
}

const getPlayerRoles = (ctx: Ctx, firstPlayer: string = '0') => {
  const orders = [...ctx.playOrder, ...ctx.playOrder];
  const first = parseInt(firstPlayer, 10) + ctx.playOrder.length;
  const [cutter, dealer] = orders.slice(first - 2, first);

  return {
    firstPlayer,
    dealer,
    cutter,
  }
}

const shuffleCards = (deck: Deck): Deck => {
  return _shuffle(deck);
};

const dealCards = (G: BeloteState, ctx: Ctx, deals: number[]) => {
  const { deck: _deck, hands: _hands, firstPlayer } = G;
  
  const deck = [..._deck];
  
  const orders = [...ctx.playOrder, ...ctx.playOrder];
  const first = parseInt(firstPlayer, 10);
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

const evaluateTable = (contract: Contract, table: Table, scores: Scores) => {
  return {
    firstPlayer: '1',
    newScores: {
      teamA: scores.teamA + 10,
      teamB: scores.teamA + 1,
    },
  };
};

export const Belote: Game<BeloteState> = {
  setup: (ctx) => ({
    contract: null,
    deck: shuffleCards(CARDS),
    scores: { teamA: 0, teamB: 0 },
    table: [],
    hand: [],
    hands: null,
    lastAppeal: null,
    appeals: APPEAL_ORDER,
    ...getPlayerRoles(ctx)
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
        cutDeck: (G, ctx) => {
          const { deck } = G;
          const left = deck.slice(0, 16);
          const right = deck.slice(16, 32);

          const newDeck = [...right, ...left];

          ctx.events?.setPhase('firstDeal');

          return {
            ...G,
            deck: newDeck,
          };
        },
      },
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
          };
        },
      },
      endIf: (G) => G.deck.length === 12,
      next: 'appeals',
    },
    /**
     * TALK: le gagnant fait la première annonce du jeu
     */
    appeals: {
      turn: {
        maxMoves: 1,
        activePlayers: {
          currentPlayer: 'appeals',
          others: 'double',
        },
        stages: {
          appeals: {
            moves: {
              appeal: (G, ctx, appeal) => {
                const { appeals } = G;

                const appealLevel = appeals.indexOf(appeal);
                const restAppeals = appeals.slice(appealLevel + 1, appeals.length);

                return {
                  ...G,
                  appeals: restAppeals,
                  lastAppeal: {
                    playerId: ctx.currentPlayer,
                    appeal,
                  },
                };
              },
              pass: (G) => {
                const { lastAppeal } = G
      
                if(lastAppeal && lastAppeal.appeal === Appeals.CLUBS) {
                  return {
                    ...G,
                    contract: lastAppeal,
                  }
                }
      
                if(lastAppeal && lastAppeal.appeal === Appeals.SANSA) {
                  return {
                    ...G,
                    contract: lastAppeal,
                  }
                }
              },
            }
          },
          double: {
            moves: {
              double: (G, ctx) => {
                const { lastAppeal } = G
      
                return {
                  ...G,
                  contract: {
                    ...lastAppeal,
                    doubled: true,
                  }
                }
              }
            }
          }
        }
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
          };
        },
      },
      endIf: (G) => G.deck.length === 0,
      next: 'play',
    },
    /**
     * PLAY: le gagnant joue la première carte
     */
    play: {
      turn: {
        maxMoves: 1,
        order: {
          first: (G) => parseInt(G.firstPlayer, 10),
          next: (G, ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
        },
      },
      moves: {
        playCard: (G, ctx, playerCard) => {
          const { hands: _hands, deck: _deck, table: _table, scores, contract } = G;
          const { currentPlayer } = ctx;
          
          // Remove card from player hand
          const playerId = `p${currentPlayer}`;
          const playerHand = _hands ? _hands[playerId].filter(card => card.num+card.color !== playerCard.num+playerCard.color) : [];
          const hands = {
            ..._hands,
            [playerId]: _hands && _hands[playerId] ? playerHand : [],
          }

          // Add card to table
          const table = [..._table, playerCard];

          // 1. Next player
          if (table.length < 4) {
            return {
              ...G,
              table,
              hands,
            };
          }

          // Evaluate the table if winner and calculate new score
          const { firstPlayer, newScores } = evaluateTable(contract, table, scores);

          const playerRoles = getPlayerRoles(ctx, firstPlayer);

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
