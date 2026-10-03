import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sounds } from '../lib/audio';

const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const winnerFor = (squares) => {
  for (const [a,b,c] of lines) if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  return null;
};

export default function TictactoeLocal() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const [score, setScore] = useState(() => JSON.parse(localStorage.getItem('ticTacToeScore') || '{"X":0,"O":0}'));
  const [timer, setTimer] = useState(10);
  const winner = winnerFor(board);
  const finished = !!winner || board.every(Boolean);

  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => setTimer((t) => {
      if (t <= 1) { sounds.timeout(); setTurn((v) => v === 'X' ? 'O' : 'X'); return 10; }
      return t - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [finished, turn]);

  const play = (i) => {
    if (board[i] || finished) return;
    sounds.move();
    const next = [...board]; next[i] = turn; setBoard(next);
    const win = winnerFor(next);
    if (win) {
      const nextScore = { ...score, [win]: score[win] + 1 };
      setScore(nextScore); localStorage.setItem('ticTacToeScore', JSON.stringify(nextScore)); sounds.win();
    } else if (next.every(Boolean)) sounds.draw();
    else setTurn((v) => v === 'X' ? 'O' : 'X');
    setTimer(10);
  };
  const reset = () => { sounds.click(); setBoard(Array(9).fill(null)); setTurn('X'); setTimer(10); };
  const resetScore = () => { sounds.click(); const s={X:0,O:0}; setScore(s); localStorage.setItem('ticTacToeScore', JSON.stringify(s)); };

  return (
    <main className="game-shell">
      <section className="game-card">
        <Link className="back-link" to="/tictactoe">← Back</Link>
        <div className="eyebrow">LOCAL 2 PLAYER</div>
        <h1>Tic Tac Toe</h1>
        <div className="score"><span>✕ {score.X}</span><span>○ {score.O}</span><span>⏱ {timer}s</span></div>
        <div className="status">{winner ? `Winner: ${winner}` : board.every(Boolean) ? 'Draw game' : `Player ${turn}'s turn`}</div>
        <div className="online-board">
          {board.map((s,i)=><button key={i} className={s==='X'?'cell x':s==='O'?'cell o':'cell'} onClick={()=>play(i)}>{s==='X'?'✕':s==='O'?'○':''}</button>)}
        </div>
        <div className="button-row"><button className="primary-btn" onClick={reset}>New Game</button><button className="secondary-btn" onClick={resetScore}>Reset Score</button></div>
      </section>
    </main>
  );
}
