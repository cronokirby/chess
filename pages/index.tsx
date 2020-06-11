import Head from 'next/head';
import { KnightBlack } from '../components/pieces';
import React from 'react';

type Pos = { x: number; y: number };

function samePos(a: Pos, b: Pos) {
  return a.x === b.x && a.y === b.y;
}

interface Square {
  pos: Pos;
  white: boolean;
}

function makeGrid(): Square[] {
  const squares: Square[] = [];
  for (let x = 0; x < 8; ++x) {
    for (let y = 0; y < 8; ++y) {
      const white = ((x ^ y) & 1) === 0;
      squares.push({ pos: { x, y }, white });
    }
  }
  return squares;
}

type Action =
  | { type: 'Move'; to: Pos }
  | { type: 'Hover'; over: Pos }
  | { type: 'LeaveHover' };

interface State {
  hovered: Pos | null;
  positioned: Pos;
}

function reduce(state: State, action: Action): State {
  console.log(action);
  switch (action.type) {
    case 'Move':
      return { ...state, positioned: action.to, hovered: null };
    case 'Hover':
      return { ...state, hovered: action.over };
    case 'LeaveHover':
      return { ...state, hovered: null };
  }
}

function Board() {
  const [{ hovered, positioned }, dispatch] = React.useReducer(reduce, {
    hovered: null,
    positioned: { x: 0, y: 0 },
  });
  return (
    <ul className="grid grid-cols-8 w-full h-full">
      {makeGrid().map(({ white, pos }, i) => (
        <li
          key={i}
          onDrop={() => dispatch({ type: 'Move', to: pos })}
          onDragOver={(e) => {
            dispatch({ type: 'Hover', over: pos });
            e.preventDefault();
          }}
          onDragLeave={() => dispatch({ type: 'LeaveHover' })}
          className={`relative flex items-center justify-center ${
            white ? 'bg-main-100' : 'bg-main-700'
          }`}
        >
          <div
            className={`transition-all duration-200 absolute bg-main-300 w-full h-full ${
              hovered && samePos(hovered, pos) ? 'opacity-50' : 'opacity-0'
            }`}
          ></div>
          {samePos(positioned, pos) ? (
            <div className="absolute w-full h-full" draggable>
              <KnightBlack />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

const Home = () => (
  <div className="container">
    <Head>
      <title>Chess</title>
    </Head>
    <div className="w-128 h-128">
      <Board></Board>
    </div>
  </div>
);

export default Home;
