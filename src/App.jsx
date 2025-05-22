import React from 'react'
import { Route ,Routes } from 'react-router-dom';
import Mainmenu from './component/mainmenu';
// import main from './pages/main';
import Tictactoe from './pages/Tictactoe';
// import Ludo from './pages/Ludo';
// import Wordquiz from './pages/Wordquiz';
// import Hexafall from './pages/Hexafall';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Mainmenu />} />
      <Route path="/tictactoe" element={<Tictactoe />} />
      <Route path="/ludo" element={<main />} />
      <Route path="/word-game" element={<main />} />
      <Route path="/hexa-fall" element={<main />} />
    </Routes>
  )
}

export default App
