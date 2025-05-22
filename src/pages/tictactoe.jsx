import React from 'react'

const tictactoe = () => {
  return (
    <>
      <div className='min-h-screen bg-slate-950 flex item-center justify-center'>
        <div className='w-full max-w-[400px] mx-5'>
              <h1 className='text-5xl font-semibold text-white mb-6 text-center'>
                  Tic toc tac
              </h1>
            <div>
              Game status
            </div>
            <div className='grid grid-cols-3 rounded-xl overflow-hidden mb-6'>

            </div>
              <button className='w-full py-3 text-lg text-white border rounded-xl hover:bg-gray-100 hover:text-gray-400 transition-colors duration-300'>
                New Game
              </button>
        </div>

      </div>

    </>
  )
}

export default tictactoe
