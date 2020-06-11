/**
 * Represents some position on a board.
 *
 * We identify positions based on the row (y) and column (x).
 */
interface Pos {
  x: number;
  y: number;
}

/**
 * Represents a generic board.
 *
 * This is just a data structure allowing us to associate positions on a board with
 * different values.
 */
export class Board<T> {
  private readonly repr: (T | null)[][];

  /**
   * Construct a square board of a certain size
   */
  constructor(size: number) {
    this.repr = [];
    for (let y = 0; y < size; ++y) {
      const row = [];
      for (let x = 0; x < size; ++x) {
        row.push(null);
      }
      this.repr.push(row);
    }
  }

  /**
   * Modify a certain position on the board
   *
   * @param pos the position to set
   * @param value the value to set that position to
   */
  set({ x, y }: Pos, value: T) {
    this.repr[y][x] = value;
  }

  /**
   * Get a certain position on the board
   *
   * @param param0 the position to fetch
   * @return null if the value isn't present, otherwise the value
   */
  get({ x, y }: Pos): T | null {
    return this.repr[y][x];
  }
}
