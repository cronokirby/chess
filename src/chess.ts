/**
 * Represents some position on a board.
 *
 * We identify positions based on the row (y) and column (x).
 */
export interface Pos {
  x: number;
  y: number;
}

/**
 * Check whether or not two positions are the same.
 */
export function samePos(p1: Pos, p2: Pos) {
  return p1.x === p2.x && p1.y === p2.y;
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
  constructor(private readonly size: number, repr?: (T | null)[][]) {
    if (!repr) {
      repr = [];
      for (let y = 0; y < size; ++y) {
        const row = [];
        for (let x = 0; x < size; ++x) {
          row.push(null);
        }
        repr.push(row);
      }
    }
    this.repr = repr;
  }

  /**
   * Return a cloned version of this board.
   */
  clone(): Board<T> {
    const repr: (T | null)[][] = [];
    for (let y = 0; y < this.size; ++y) {
      const row = [];
      for (let x = 0; x < this.size; ++x) {
        row.push(this.get({ x, y }));
      }
      repr.push(row);
    }
    return new Board(this.size, repr);
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

  /**
   * Get all of the values contained
   */
  *values() {
    for (let y = 0; y < this.size; ++y) {
      for (let x = 0; x < this.size; ++x) {
        yield { pos: { x, y }, value: this.get({ x, y }) };
      }
    }
  }
}

/**
 * Represents the color of a chess piece
 */
export enum Color {
  Black,
  White,
}

/**
 * Represents what kind of piece we have
 */
export enum PieceKind {
  Pawn,
  Knight,
  Bishop,
  Rook,
  Queen,
  King,
}

/**
 * Represents a complete piece, with color and kind
 */
export interface Piece {
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
  protected readonly board: Board<Piece>;

  /**
   * Setup a new chess board
   */
  constructor(board?: Board<Piece>) {
    if (!board) {
      board = new Board(8);
      for (let x = 0; x < 8; ++x) {
        board.set({ x, y: 1 }, { color: Color.Black, kind: PieceKind.Pawn });
        board.set({ x, y: 6 }, { color: Color.White, kind: PieceKind.Pawn });
      }
      const orders = [
        PieceKind.Rook,
        PieceKind.Knight,
        PieceKind.Bishop,
        PieceKind.Queen,
        PieceKind.King,
        PieceKind.Bishop,
        PieceKind.Knight,
        PieceKind.Rook,
      ];
      for (let i = 0; i < orders.length; ++i) {
        board.set({ x: i, y: 0 }, { color: Color.Black, kind: orders[i] });
        board.set({ x: i, y: 7 }, { color: Color.White, kind: orders[i] });
      }
    }
    this.board = board;
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

  protected *pieces() {
    for (const { pos, value } of this.board.values()) {
      yield { pos, piece: value };
    }
  }
}

/**
 * Represents the information we need to be able to draw a square.
 */
export interface Square {
  /**
   * The position of the square on the grid
   */
  pos: Pos;
  /**
   * The color of the square
   */
  color: Color;
  /**
   * The piece currently occupying this square, if any
   */
  piece: Piece | null;
  /**
   * Whether or not the user is hovering over this square
   */
  hovered: boolean;
}

/**
 * Represents all the visual aspect of a chess board, in adddition to just the logical aspects.
 */
export class VisualChessBoard extends LogicalChessBoard {
  constructor(
    private hoveredPos: Pos | null = null,
    private draggingFrom: Pos | null = null,
    board?: Board<Piece>,
  ) {
    super(board);
  }

  clone() {
    return new VisualChessBoard(
      this.hoveredPos,
      this.draggingFrom,
      this.board.clone(),
    );
  }

  /**
   * The handler for when a continuous drag enters a square
   */
  onDragEnter(pos: Pos) {
    this.hoveredPos = pos;
  }

  /**
   * The handler for when a continous drag leaves a square
   */
  onDragLeave() {
    this.hoveredPos = null;
  }

  /**
   * The handler for when a drag event starts
   */
  onDragStart(pos: Pos) {
    this.draggingFrom = pos;
  }

  /**
   * The handler for when a drag event ends
   */
  onDragEnd(pos: Pos) {
    this.hoveredPos = null;
    if (this.draggingFrom !== null) {
      this.move(this.draggingFrom, pos);
    }
  }

  /**
   * Return all the squares in this board, row by row, column by column
   */
  *squares() {
    for (const { pos, piece } of this.pieces()) {
      const isWhite = ((pos.x ^ pos.y) & 1) === 0;
      const color = isWhite ? Color.White : Color.Black;
      const hovered = this.hoveredPos && samePos(pos, this.hoveredPos);
      yield { pos, color, piece, hovered };
    }
  }
}
