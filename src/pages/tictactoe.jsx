import React, { useState, useEffect } from 'react';

const Tictactoe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [timer, setTimer] = useState(10);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  
  useEffect(() => {
    const savedScore = JSON.parse(localStorage.getItem('ticTacToeScore'));
    if (savedScore) setScore(savedScore);
  }, []);

  
  useEffect(() => {
    const winner = getWinner(board);
    if (winner || board.every(square => square)) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          handleTimeout();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [board, isXTurn]);

  const getWinner = (squares) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleSquareClick = (index) => {
    if (board[index] || getWinner(board)) return;

    const updatedBoard = [...board];
    updatedBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(updatedBoard);

    const winner = getWinner(updatedBoard);
    if (winner) {
      const newScore = {
        ...score,
        [winner]: score[winner] + 1
      };
      setScore(newScore);
      localStorage.setItem('ticTacToeScore', JSON.stringify(newScore));
    }

    setIsXTurn(!isXTurn);
    setTimer(10); // Reset timer
  };

  const handleTimeout = () => {
    setIsXTurn(prev => !prev);
    setTimer(10);
  };

  const getGameStatus = () => {
    const winner = getWinner(board);
    if (winner) return `Winner: ${winner}`;
    if (board.every(square => square !== null)) return 'Draw!';
    return `Next player: ${isXTurn ? 'X' : 'O'}`;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setTimer(10);
  };

  const resetScore = () => {
    setScore({ X: 0, O: 0 });
    localStorage.removeItem('ticTacToeScore');
  };

  return (
    <div className='min-h-screen bg-slate-950 flex items-center justify-center'>
      <div className='w-full max-w-[400px] mx-5'>
        <h1 className='text-5xl font-semibold text-white mb-6 text-center'>Tic Tac Toe</h1>

        <div className='text-white text-center mb-4 text-lg'>
          <p>X: {score.X} | O: {score.O}</p>
          <p>Timer: <span className='text-yellow-400 font-bold'>{timer}s</span></p>
        </div>

        <div className={`text-center mb-6 ${getWinner(board) ? "text-2xl font-bold text-green-600 animate-bounce" : "text-xl text-white"}`}>
              {getGameStatus()}

            </div>


        <div className='grid grid-cols-3 gap-2 rounded-xl overflow-hidden mb-6'>
          {board.map((square, index) => (
            <button
              key={index}
              onClick={() => handleSquareClick(index)}
              className={`w-20 h-20 lg:w-24 lg:h-24 border-2 border-gray-800 text-4xl font-bold transition duration-200 ${
                square === 'X' ? 'text-blue-500' : 'text-red-500'
              } hover:bg-gray-800`}
            >
              {square}
            </button>
          ))}
        </div>

        <button
          onClick={resetGame}
          className='w-full py-3 text-lg text-white border rounded-xl hover:bg-gray-100 hover:text-gray-400 transition-colors duration-300 mb-3'>
          New Game
        </button>

        <button
          onClick={resetScore}
          className='w-full py-3 text-lg text-white border border-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors duration-300'>
          Reset Score
        </button>
      </div>
    </div>
  );
};

export default Tictactoe;