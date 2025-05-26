import React from 'react'
import { Route ,Routes } from 'react-router-dom';
import Mainmenu from './component/Mainmenu';
import Tictactoe from './pages/tictactoe';
// import Ludo from './pages/Ludo';
// import Wordquiz from './pages/Wordquiz';
import Hexafall from './pages/hexafall';
import TictactoeOnline from './pages/tictactoeonline';
import TictactoeLocal from './pages/tictactoelocal'
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Mainmenu />} />
      <Route path="/tictactoe" element={<Tictactoe />} />
      <Route path="/hexa-fall" element={<Hexafall />} />
      <Route path="/tictactoeonline" element={<TictactoeOnline />} />
      <Route path="/tictactoelocal" element={<TictactoeLocal />} />
      
    </Routes>
  )
}

export default App
