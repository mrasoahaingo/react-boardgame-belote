import { Local } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import { Belote } from './Game';
import { Board } from './Board';

export default Client({
  game: Belote,
  board: Board,
  numPlayers: 4,
  multiplayer: Local(),
});
