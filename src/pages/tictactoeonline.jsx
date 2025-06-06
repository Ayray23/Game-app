import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://game-server-5q0s.onrender.com/');

const tictactoe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [status, setStatus] = useState('Waiting for opponent...');
  const [score, setScore] = useState(() => {
    const stored = localStorage.getItem('tictactoe_score');
    return stored ? JSON.parse(stored) : { X: 0, O: 0 };
  });

  useEffect(() => {
    socket.on('player-assigned', (symbol) => {
      setPlayerSymbol(symbol);
      setStatus(`You are ${symbol}`);
    });

    socket.on('game-state', ({ board, currentTurn }) => {
      setBoard(board);
      setIsXTurn(currentTurn === 'X');
      setStatus(
        currentTurn === playerSymbol
          ? 'Your turn'
          : "Waiting for opponent's turn"
      );
    });

    return () => {
      socket.off('player-assigned');
      socket.off('game-state');
    };
  }, [playerSymbol]);

  const handleClick = (index) => {
    if (board[index]) return;
    if ((isXTurn && playerSymbol !== 'X') || (!isXTurn && playerSymbol !== 'O')) {
      setStatus("Wait for your turn...");
      return;
    }
    socket.emit('make-move', index);
  };

  const getWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const resetScores = () => {
    const newScore = { X: 0, O: 0 };
    setScore(newScore);
    localStorage.setItem('tictactoe_score', JSON.stringify(newScore));
  };

  return (
    <div className='min-h-screen bg-slate-950 flex items-center justify-center'>
      <div className='w-full max-w-[400px] mx-5'>
        <h1 className='text-5xl font-semibold text-white mb-6 text-center'>Tic Tac Toe</h1>
        <div className='text-white text-center mb-4'>{status}</div>
        <div className='text-white text-xl mb-2'>Score: X: {score.X} | O: {score.O}</div>

        <div className='grid grid-cols-3 gap-2 mb-6'>
          {board.map((square, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`w-24 h-24 border-2 text-4xl font-bold transition-colors duration-200 ${
                square === 'X' ? 'text-blue-500' : 'text-red-500'
              } bg-white`}
            >
              {square}
            </button>
          ))}
        </div>

        <button
          onClick={resetScores}
          className='w-full py-2 text-white border border-red-400 rounded hover:bg-red-400 hover:text-white transition duration-300'
        >
          Reset Scores
        </button>
      </div>
    </div>
  );
};

export default tictactoe;