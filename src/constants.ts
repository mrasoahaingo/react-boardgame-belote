export enum CardStatus {
  DECK,
  HAND,
  TABLE,
}
export type Card = {
  num: string;
  owner: string | null;
  status: CardStatus;
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

export const CARDS: Deck = [
  { num: '7♠', owner: null, status: CardStatus.DECK },
  { num: '8♠', owner: null, status: CardStatus.DECK },
  { num: '9♠', owner: null, status: CardStatus.DECK },
  { num: '10♠', owner: null, status: CardStatus.DECK },
  { num: 'J♠', owner: null, status: CardStatus.DECK },
  { num: 'Q♠', owner: null, status: CardStatus.DECK },
  { num: 'K♠', owner: null, status: CardStatus.DECK },
  { num: 'A♠', owner: null, status: CardStatus.DECK },
  { num: '7♥', owner: null, status: CardStatus.DECK },
  { num: '8♥', owner: null, status: CardStatus.DECK },
  { num: '9♥', owner: null, status: CardStatus.DECK },
  { num: '10♥', owner: null, status: CardStatus.DECK },
  { num: 'J♥', owner: null, status: CardStatus.DECK },
  { num: 'Q♥', owner: null, status: CardStatus.DECK },
  { num: 'K♥', owner: null, status: CardStatus.DECK },
  { num: 'A♥', owner: null, status: CardStatus.DECK },
  { num: '7♦', owner: null, status: CardStatus.DECK },
  { num: '8♦', owner: null, status: CardStatus.DECK },
  { num: '9♦', owner: null, status: CardStatus.DECK },
  { num: '10♦', owner: null, status: CardStatus.DECK },
  { num: 'J♦', owner: null, status: CardStatus.DECK },
  { num: 'Q♦', owner: null, status: CardStatus.DECK },
  { num: 'K♦', owner: null, status: CardStatus.DECK },
  { num: 'A♦', owner: null, status: CardStatus.DECK },
  { num: '7♣', owner: null, status: CardStatus.DECK },
  { num: '8♣', owner: null, status: CardStatus.DECK },
  { num: '9♣', owner: null, status: CardStatus.DECK },
  { num: '10♣', owner: null, status: CardStatus.DECK },
  { num: 'J♣', owner: null, status: CardStatus.DECK },
  { num: 'Q♣', owner: null, status: CardStatus.DECK },
  { num: 'K♣', owner: null, status: CardStatus.DECK },
  { num: 'A♣', owner: null, status: CardStatus.DECK },
];

export const DEALS = [3, 2, 3];
