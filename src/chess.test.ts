import { Board } from './chess';

test('basic board manipulation works', () => {
  const board = Board.ofSize(8);
  board.set({ x: 0, y: 0 }, 'knight');
  board.set({ x: 0, y: 1 }, 'knight');
  expect(board.get({ x: 0, y: 0 })).toBe('knight');
  expect(board.get({ x: 0, y: 1 })).toBe('knight');
  expect(board.get({ x: 7, y: 7 })).toBe(null);
});
