export type Contract = {
  playerId: string;
  appeal: string;
  doubled: boolean;
} | null;

export type Card = {
  num: string;
  color: string;
  owner: string | null;
  isAllowed: boolean;
};
export type Deck = Card[];
export type Hand = Card[];
export type Table = Card[];
export type Hands = Record<string, Hand> | null;

export type Scores = {
  teamA: number;
  teamB: number;
};

export const CARDS: Deck = [
  { num: '7', color: '♠', owner: null, isAllowed: false },
  { num: '8', color: '♠', owner: null, isAllowed: false },
  { num: '9', color: '♠', owner: null, isAllowed: false },
  { num: '10', color: '♠', owner: null, isAllowed: false },
  { num: 'J', color: '♠', owner: null, isAllowed: false },
  { num: 'Q', color: '♠', owner: null, isAllowed: false },
  { num: 'K', color: '♠', owner: null, isAllowed: false },
  { num: 'A', color: '♠', owner: null, isAllowed: false },
  { num: '7', color: '♥', owner: null, isAllowed: false },
  { num: '8', color: '♥', owner: null, isAllowed: false },
  { num: '9', color: '♥', owner: null, isAllowed: false },
  { num: '10', color: '♥', owner: null, isAllowed: false },
  { num: 'J', color: '♥', owner: null, isAllowed: false },
  { num: 'Q', color: '♥', owner: null, isAllowed: false },
  { num: 'K', color: '♥', owner: null, isAllowed: false },
  { num: 'A', color: '♥', owner: null, isAllowed: false },
  { num: '7', color: '♦', owner: null, isAllowed: false },
  { num: '8', color: '♦', owner: null, isAllowed: false },
  { num: '9', color: '♦', owner: null, isAllowed: false },
  { num: '10', color: '♦', owner: null, isAllowed: false },
  { num: 'J', color: '♦', owner: null, isAllowed: false },
  { num: 'Q', color: '♦', owner: null, isAllowed: false },
  { num: 'K', color: '♦', owner: null, isAllowed: false },
  { num: 'A', color: '♦', owner: null, isAllowed: false },
  { num: '7', color: '♣', owner: null, isAllowed: false },
  { num: '8', color: '♣', owner: null, isAllowed: false },
  { num: '9', color: '♣', owner: null, isAllowed: false },
  { num: '10', color: '♣', owner: null, isAllowed: false },
  { num: 'J', color: '♣', owner: null, isAllowed: false },
  { num: 'Q', color: '♣', owner: null, isAllowed: false },
  { num: 'K', color: '♣', owner: null, isAllowed: false },
  { num: 'A', color: '♣', owner: null, isAllowed: false },
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

export const APPEAL_COLORS = [
  Appeals.CLUBS,
  Appeals.DIAMONDS,
  Appeals.HEARTS,
  Appeals.SPADES,
]

export const APPEAL_ORDER = [
  ...APPEAL_COLORS,
  Appeals.SANSA,
  Appeals.TOUTA,
];

export const TOUTA = ['7', '8', 'Q', 'K', '10', 'A', '9', 'J'];
export const SANSA = ['7', '8', '9', 'J', 'Q', 'K', '10', 'A'];
