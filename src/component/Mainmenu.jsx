import React from 'react';
import { Link } from 'react-router-dom';

const Mainmenu = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-10">Multiplayer Game Hub</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        <Link to="/tictactoe" className="text-white text-2xl font-semibold border-4 border-pink-500 rounded-xl py-6 text-center hover:scale-105 transition">
          Tic Tac Toe
        </Link>
        <Link to="/ludo" className="text-white text-2xl font-semibold border-4 border-blue-500 rounded-xl py-6 text-center hover:scale-105 transition">
          Ludo
        </Link>
        <Link to="/word-game" className="text-white text-2xl font-semibold border-4 border-yellow-400 rounded-xl py-6 text-center hover:scale-105 transition">
          Word Quiz
        </Link>
        <Link to="/hexa-fall" className="text-white text-2xl font-semibold border-4 border-green-400 rounded-xl py-6 text-center hover:scale-105 transition">
          Hexa Fall
        </Link>
      </div>
    </div>
  );
};

export default Mainmenu;
