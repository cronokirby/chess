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
   * Remove the value at a certain position.
   *
   * This does nothing if no value is present at that position.
   *
   * @param param0 the position to remove the value of
   */
  remove({ x, y }: Pos) {
    this.repr[y][x] = null;
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

/**
 * Represents the color of a chess piece
 */
enum Color {
  Black,
  White,
}

/**
 * Represents what kind of piece we have
 */
enum PieceKind {
  Knight,
}

/**
 * Represents a complete piece, with color and kind
 */
interface Piece {
  color: Color;
  kind: PieceKind;
}

/**
 * Represents the logical actions that can take place on a chess board.
 *
 * This doesn't contain all of the logic we need for displaying the board, as
 * it's missing information like hovers, and what not, but that's handled at a separate
 * layer.
 */
class LogicalChessBoard {
  private readonly board: Board<Piece>;

  /**
   * Setup a new chess board
   */
  constructor() {
    this.board = new Board(8);
    this.board.set(
      { x: 0, y: 0 },
      { color: Color.Black, kind: PieceKind.Knight },
    );
  }

  /**
   * Move a piece at one position to another position.
   * 
   * This does nothing if there's no piece there
   * 
   * @param at the position to pick up a piece
   * @param to the position to move a piece
   */
  move(at: Pos, to: Pos): boolean {
    const piece = this.board.get(at);
    if (piece === null) {
      return false;
    }
    this.board.set(to, piece);
    this.board.remove(at);
    return true;
  }
}
