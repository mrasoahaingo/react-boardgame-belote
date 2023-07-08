export type Card = {
  num: string;
  owner: string | null;
};
export type Deck = Card[]; // Record<string, string | number>;
export type Hand = Card[];
export type Table = Card[];
export enum DeckStatus {
  SHUFFLED,
  CUTTED,
  DEALED,
  CONTRACT,
}
export type Scores = {
  teamA: number,
  teamB: number,
}

export const CARDS: Deck = [
  { num: '7♠', owner: null },
  { num: '8♠', owner: null },
  { num: '9♠', owner: null },
  { num: '10♠', owner: null },
  { num: 'J♠', owner: null },
  { num: 'Q♠', owner: null },
  { num: 'K♠', owner: null },
  { num: 'A♠', owner: null },
  { num: '7♥', owner: null },
  { num: '8♥', owner: null },
  { num: '9♥', owner: null },
  { num: '10♥', owner: null },
  { num: 'J♥', owner: null },
  { num: 'Q♥', owner: null },
  { num: 'K♥', owner: null },
  { num: 'A♥', owner: null },
  { num: '7♦', owner: null },
  { num: '8♦', owner: null },
  { num: '9♦', owner: null },
  { num: '10♦', owner: null },
  { num: 'J♦', owner: null },
  { num: 'Q♦', owner: null },
  { num: 'K♦', owner: null },
  { num: 'A♦', owner: null },
  { num: '7♣', owner: null },
  { num: '8♣', owner: null },
  { num: '9♣', owner: null },
  { num: '10♣', owner: null },
  { num: 'J♣', owner: null },
  { num: 'Q♣', owner: null },
  { num: 'K♣', owner: null },
  { num: 'A♣', owner: null },
];

export const DEALS = [3, 2, 3];
