import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Tictactoe() {
  const [mode, setMode] = useState(null);
  if (mode === 'online') return <TictactoeOnlinePicker />;
  if (mode === 'local') return <LocalPicker />;
  return (
    <main className="game-shell">
      <section className="setup-card">
        <Link className="back-link" to="/">← Back to hub</Link>
        <div className="eyebrow">ARCADE</div><h1>Tic Tac Toe</h1>
        <p className="muted">Choose how you want to play.</p>
        <div className="mode-grid">
          <button onClick={() => setMode('local')} className="mode-card"><span>🎮</span><b>Play Locally</b><small>Two players on one device</small></button>
          <button onClick={() => setMode('online')} className="mode-card"><span>🌐</span><b>Play Online</b><small>Create or join a room</small></button>
        </div>
      </section>
    </main>
  );
}
function LocalPicker(){ window.location.href='/tictactoelocal'; return null; }
function TictactoeOnlinePicker(){ window.location.href='/tictactoeonline'; return null; }
