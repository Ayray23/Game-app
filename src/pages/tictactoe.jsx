import React, { useState } from 'react';
import TictactoeOnline from './tictactoeonline';
import TictactoeLocal from './tictactoelocal';

const Tictactoe = () => { const [mode, setMode] = useState(null);

if (mode === 'online') 
return <TictactoeOnline />; 
if (mode === 'local') 
return <TictactoeLocal />;

return ( 
  <div className='min-h-screen bg-slate-950 flex items-center justify-center'> 
      <div className='w-full max-w-[400px] mx-5 text-center'>
          <h1 className='text-5xl font-semibold text-white mb-6'>Tic Tac Toe</h1> 
          <p className='text-white text-lg mb-4'>Choose a mode to start playing:</p>
          <div className='space-y-4'> 
            <button 
              onClick={() => setMode('local')}
              className='w-[250px] text-white text-2xl font-semibold border-4 border-pink-500 rounded-xl py-4 text-center hover:scale-105 transition'> Play Locally 
            </button> 
            <button 
              onClick={() => setMode('online')}
              className='w-[250px] text-white text-2xl font-semibold border-4 border-blue-500 rounded-xl py-4 text-center hover:scale-105 transition'> Play Online 
            </button>
          </div> 
        </div> 
  </div>
   );
   };

export default Tictactoe;