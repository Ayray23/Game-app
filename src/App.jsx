import React from 'react'
import { Route ,Routes } from 'react-router-dom';
import Mainmenu from './component/Mainmenu';
import Tictactoe from './pages/tictactoe';
// import Ludo from './pages/Ludo';
// import Wordquiz from './pages/Wordquiz';
import Hexafall from './pages/Hexafall';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Mainmenu />} />
      <Route path="/tictactoe" element={<Tictactoe />} />
      <Route path="/hexa-fall" element={<Hexafall />} />
    </Routes>
  )
}

export default App
