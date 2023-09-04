import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    xIsNext ? nextSquares[i] = "X" : nextSquares[i] = "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  winner ? (status = "Winner: " + winner) : (status = "Next player: " + (xIsNext ? "X" : "O"));

  function MakeBoard() {
    const boardRows = [];
    for (let i = 0; i < 3; i++) {
      const rowSquares = [];
      for (let j = i * 3; j < i * 3 + 3; j++) {
        rowSquares.push(
          <Square value={squares[j]} onSquareClick={() => handleClick(j)} />
        );
      }
      boardRows.push(<div className='board-row'>{rowSquares}</div>);
    }
    return boardRows;
  }

  return (
    <>
      <div className='status'>{status}</div>
      <MakeBoard />
    </>
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === 0) {
      description = 'Go to game start';
    } else if (move === history.length - 1) {
      description = 'You are at move #' + move;
    } else {
      description = 'Go to move #' + move;
    }
    return (
      <li key={move}>
        {move === history.length - 1 ? description : <button onClick={() => jumpTo(move)}>{description}</button>}

      </li>
    )
  })

  let historyList = document.getElementById('history-list');

  function flipList() {
    historyList.classList.toggle('reverse');
  }

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <button onClick={() => flipList()}>Flip list</button>
        <ul id='history-list'>{moves}</ul>
      </div>
    </div>
  );
}

