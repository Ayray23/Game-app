import React from 'react';
import { Link } from 'react-router-dom';

export default function Mainmenu() {
  return (
    <main className="game-shell">
      <section className="hub-card">
        <div className="eyebrow">GAME HUB</div>
        <h1>Arcade Arena</h1>
        <p className="muted">Play locally, challenge a friend online, and chat in real time.</p>
        <div className="game-grid">
          <Link to="/tictactoe" className="game-tile pink"><span>✕ ○</span><b>Tic Tac Toe</b><small>Local + online multiplayer</small></Link>
          <Link to="/hexa-fall" className="game-tile green"><span>◈</span><b>Pokemon Memory</b><small>Solo memory challenge</small></Link>
        </div>
        <div className="feature-row"><span>🔊 Sound effects</span><span>⚡ Live multiplayer</span><span>💬 In-game chat</span></div>
      </section>
    </main>
  );
}
