import Head from 'next/head';
import React from 'react';
import ShowPiece from '../components/ShowPiece';
import { Color, Pos, VisualChessBoard } from '../src/chess';

type Action =
  | { type: 'OnDragStart'; on: Pos }
  | { type: 'OnDragEnter'; over: Pos }
  | { type: 'OnDragLeave' }
  | { type: 'OnDragEnd'; on: Pos };

type State = VisualChessBoard;

function reduce(state: State, action: Action): State {
  const cloned = state.clone();
  console.log('action');
  switch (action.type) {
    case 'OnDragStart':
      cloned.onDragStart(action.on);
      break;
    case 'OnDragEnter':
      cloned.onDragEnter(action.over);
      break;
    case 'OnDragLeave':
      cloned.onDragLeave();
      break;
    case 'OnDragEnd':
      cloned.onDragEnd(action.on);
      break;
  }
  return cloned;
}

function Board() {
  const [board, dispatch] = React.useReducer(reduce, new VisualChessBoard());

  return (
    <ul className="grid grid-cols-8 w-full h-full">
      {[...board.squares()].map(({ pos, color, piece, hovered }, i) => (
        <li
          key={i}
          onDrop={() => dispatch({ type: 'OnDragEnd', on: pos })}
          onDragOver={(e) => {
            dispatch({ type: 'OnDragEnter', over: pos });
            e.preventDefault();
          }}
          onDragLeave={() => dispatch({ type: 'OnDragLeave' })}
          className={`relative flex items-center justify-center ${
            color === Color.White ? 'bg-main-100' : 'bg-main-700'
          }`}
        >
          <div
            className={`transition-all duration-200 absolute bg-main-300 w-full h-full ${
              hovered ? 'opacity-50' : 'opacity-0'
            }`}
          ></div>
          {!piece ? null : (
            <div
              className="absolute w-full h-full"
              draggable
              onDragStart={() => dispatch({ type: 'OnDragStart', on: pos })}
            >
              <ShowPiece piece={piece} />
            </div>
          )}
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
    <div className="board-container">
      <Board></Board>
    </div>
  </div>
);

export default Home;
