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
  /**
   * Create a square board with a certain size
   *
   * @param size the number of rows and columns the board should have
   */
  static ofSize<T>(size: number) {
    const rows: (T | null)[][] = [];
    for (let y = 0; y < size; ++y) {
      const row = [];
      for (let x = 0; x < size; ++x) {
        row.push(null);
      }
      rows.push(row);
    }
    return new Board(rows, size);
  }

  private constructor(
    private readonly repr: (T | null)[][],
    private readonly size: number,
  ) {}

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
