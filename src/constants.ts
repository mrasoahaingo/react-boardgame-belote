export type Contract = {
  playerId: string | null;
  appeal: string | null;
  doubled: boolean;
} | null;

export type Card = {
  num: string;
  color: string;
  owner: string | null;
};
export type Deck = Card[]; // Record<string, string | number>;
export type Hand = Card[];
export type Table = Card[];

export type Scores = {
  teamA: number,
  teamB: number,
}

export const CARDS: Deck = [
  { num: '7', color: '♠', owner: null },
  { num: '8', color: '♠', owner: null },
  { num: '9', color: '♠', owner: null },
  { num: '10', color: '♠', owner: null },
  { num: 'J', color: '♠', owner: null },
  { num: 'Q', color: '♠', owner: null },
  { num: 'K', color: '♠', owner: null },
  { num: 'A', color: '♠', owner: null },
  { num: '7', color: '♥', owner: null },
  { num: '8', color: '♥', owner: null },
  { num: '9', color: '♥', owner: null },
  { num: '10', color: '♥', owner: null },
  { num: 'J', color: '♥', owner: null },
  { num: 'Q', color: '♥', owner: null },
  { num: 'K', color: '♥', owner: null },
  { num: 'A', color: '♥', owner: null },
  { num: '7', color: '♦', owner: null },
  { num: '8', color: '♦', owner: null },
  { num: '9', color: '♦', owner: null },
  { num: '10', color: '♦', owner: null },
  { num: 'J', color: '♦', owner: null },
  { num: 'Q', color: '♦', owner: null },
  { num: 'K', color: '♦', owner: null },
  { num: 'A', color: '♦', owner: null },
  { num: '7', color: '♣', owner: null },
  { num: '8', color: '♣', owner: null },
  { num: '9', color: '♣', owner: null },
  { num: '10', color: '♣', owner: null },
  { num: 'J', color: '♣', owner: null },
  { num: 'Q', color: '♣', owner: null },
  { num: 'K', color: '♣', owner: null },
  { num: 'A', color: '♣', owner: null },
];

export const DEALS = [3, 2, 3];

export enum Appeals {
  SPADES = '♠',
  HEARTS = '♥',
  DIAMONDS = '♦',
  CLUBS = '♣',
  SANSA = 'SANSA',
  TOUTA = 'TOUTA',
}

export const APPEAL_ORDER = [
  Appeals.CLUBS,
  Appeals.DIAMONDS,
  Appeals.HEARTS,
  Appeals.SPADES,
  Appeals.SANSA,
  Appeals.TOUTA,
]

export const TOUTA = ['7', '8', 'Q', 'K', '10', 'A', '9', 'J'];
export const SANSA = ['7', '8', '9', 'J', 'Q', 'K', '10', 'A'];
