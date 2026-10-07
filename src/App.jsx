import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Mainmenu from './component/Mainmenu';
import Tictactoe from './pages/tictactoe';
import Hexafall from './pages/hexafall';
import TictactoeOnline from './pages/tictactoeonline';
import TictactoeLocal from './pages/tictactoelocal';
import Ludo from './pages/ludo';
import ConnectFour from './pages/connectfour';
import Battleship from './pages/battleship';
import Wordquiz from './pages/wordquiz';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<Mainmenu />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      <Route path="/tictactoe" element={<Tictactoe />} />
      <Route path="/tictactoeonline" element={<TictactoeOnline />} />
      <Route path="/tictactoelocal" element={<TictactoeLocal />} />
      <Route path="/ludo" element={<Ludo />} />
      <Route path="/connect-four" element={<ConnectFour />} />
      <Route path="/battleship" element={<Battleship />} />
      <Route path="/hexa-fall" element={<Hexafall />} />
      <Route path="/wordquiz" element={<Wordquiz />} />
      <Route path="*" element={<Mainmenu />} />
    </Routes>
    </AuthProvider>
  );
}
