import React, { useState } from 'react';

const tictactoe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  function getWinner(squares) {
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  function handleSquareClick(index) {
    if (board[index] || getWinner(board)) return;

    const updatedBoard = [...board];
    updatedBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(updatedBoard);
    setIsXTurn(!isXTurn);
  }

  function getGameStatus() {
    const winner = getWinner(board);
    if (winner) {
      return `Winner: ${winner}`;
    } else if (board.every(square => square)) {
      return 'Draw!';
    } else {
      return `Next player: ${isXTurn ? 'X' : 'O'}`;
    }
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
  }

  return (
    <>
      <div className='min-h-screen bg-slate-950 flex items-center justify-center'>
        <div className='w-full max-w-[400px] mx-5'>
          <h1 className='text-5xl font-semibold text-white mb-6 text-center'>Tic Tac Toe</h1>

            <div className={`text-center mb-6 ${getWinner(board) ? "text-2xl font-bold text-green-600 animate-bounce" : "text-xl text-white" }`}>
              {getGameStatus()}

            </div>


          <div className='grid grid-cols-3 gap-2 rounded-xl overflow-hidden mb-6'>
            {board.map((square, index) => (
              <button
                key={index}
                onClick={() => handleSquareClick(index)}
                className={`w-20 h-20 lg:w-28 lg:h-28 border-2  border-gray-800 text-4xl font-bold transition duration-200 ${
                  square === 'X' ? 'text-blue-500' : 'text-red-500'
                } hover:bg-gray-800`}>
                {square}
              </button>
            ))}
          </div>

          <button
            onClick={resetGame}
            className='w-full py-3 text-lg text-white border rounded-xl hover:bg-gray-100 hover:text-gray-400 transition-colors duration-300'>
            New Game
          </button>
        </div>
      </div>
                
    </>

  );
};

export default tictactoe;