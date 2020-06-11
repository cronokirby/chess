import { Board } from './chess';

test('basic board manipulation works', () => {
  const board = Board.ofSize(8);
  expect(board.set({ x: 0, y: 0 }, 'knight').get({ x: 0, y: 0 })).toBe(
    'knight',
  );
  expect(board.set({ x: 0, y: 1 }, 'knight').get({ x: 0, y: 1 })).toBe(
    'knight',
  );
});
