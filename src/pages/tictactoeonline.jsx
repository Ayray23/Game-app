import React, { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import { sounds } from '../lib/audio';
import VoiceChat from '../component/VoiceChat';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://game-server-5q0s.onrender.com';
const socket = io(SOCKET_URL, { autoConnect: false });

const winnerFor = (squares) => {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
  return null;
};

const makeCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

export default function TictactoeOnline() {
  const [phase, setPhase] = useState('setup');
  const [name, setName] = useState('');
  const [roomInput, setRoomInput] = useState('');
  const [roomId, setRoomId] = useState('');
  const [symbol, setSymbol] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [players, setPlayers] = useState([]);
  const [turn, setTurn] = useState('X');
  const [status, setStatus] = useState('Connect to a room');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const chatRef = useRef(null);

  const winner = useMemo(() => winnerFor(board), [board]);
  const me = players.find((p) => p.symbol === symbol);
  const opponent = players.find((p) => p.symbol !== symbol);
  const myTurn = phase === 'game' && turn === symbol && !winner && board.some((v) => !v);

  useEffect(() => {
    const onCreated = ({ roomId: id, symbol: assigned }) => {
      setRoomId(id); setSymbol(assigned); setPhase('waiting'); setStatus('Waiting for another player…'); setError('');
      sounds.join();
    };
    const onJoined = ({ roomId: id, symbol: assigned }) => {
      setRoomId(id); setSymbol(assigned); setPhase('game'); setStatus('Game started'); setError('');
      sounds.join();
    };
    const onState = (state) => {
      setRoomId(state.roomId);
      setBoard(state.board);
      setTurn(state.currentTurn);
      setPlayers(state.players);
      if (state.status === 'waiting') { setPhase('waiting'); setStatus('Waiting for opponent…'); }
      else if (state.status === 'playing') { setPhase('game'); setStatus(state.currentTurn === symbol ? 'Your turn' : 'Opponent’s turn'); }
      else if (state.winner) { setPhase('finished'); setStatus(state.winner === symbol ? 'You won! 🎉' : 'Opponent won'); }
      else if (state.draw) { setPhase('finished'); setStatus('Draw game'); }
    };
    const onChat = (msg) => { setMessages((prev) => [...prev.slice(-49), msg]); if (msg.id) sounds.message(); };
    const onError = (msg) => setError(msg);
    const onLeft = () => { setPhase('waiting'); setStatus('Opponent left — waiting for another player…'); setPlayers([]); setBoard(Array(9).fill(null)); };

    socket.on('roomCreated', onCreated);
    socket.on('roomJoined', onJoined);
    socket.on('game-state', onState);
    socket.on('chat-message', onChat);
    socket.on('errorMessage', onError);
    socket.on('playerLeft', onLeft);
    socket.connect();

    return () => {
      socket.off('roomCreated', onCreated); socket.off('roomJoined', onJoined);
      socket.off('game-state', onState); socket.off('chat-message', onChat);
      socket.off('errorMessage', onError); socket.off('playerLeft', onLeft);
      socket.disconnect();
    };
  }, [symbol]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const enterName = name.trim().slice(0, 20);
  const createRoom = () => {
    if (!enterName) return setError('Enter your name first.');
    setError('');
    socket.emit('createRoom', { roomId: makeCode(), name: enterName });
  };
  const joinRoom = () => {
    if (!enterName) return setError('Enter your name first.');
    if (!roomInput.trim()) return setError('Enter a room code.');
    setError('');
    socket.emit('joinRoom', { roomId: roomInput.trim().toUpperCase(), name: enterName });
  };
  const move = (index) => {
    if (!myTurn || board[index]) return;
    sounds.move();
    socket.emit('make-move', { roomId, index });
  };
  const rematch = () => {
    sounds.click();
    socket.emit('rematch', { roomId });
  };
  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !roomId) return;
    socket.emit('chat-message', { roomId, text: message });
    setMessage('');
  };

  if (phase === 'setup') return (
    <main className="game-shell">
      <section className="setup-card">
        <Link className="back-link" to="/tictactoe">← Back</Link>
        <div className="eyebrow">ONLINE MULTIPLAYER</div>
        <h1>Tic Tac Toe</h1>
        <p className="muted">Create a private room or join a friend with a room code.</p>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your display name" maxLength={20} />
        <div className="setup-actions">
          <button className="primary-btn" onClick={createRoom}>Create Room</button>
          <div className="join-row">
            <input value={roomInput} onChange={(e) => setRoomInput(e.target.value.toUpperCase())} placeholder="ROOM CODE" maxLength={8} />
            <button className="secondary-btn" onClick={joinRoom}>Join</button>
          </div>
        </div>
        {error && <div className="error-box">{error}</div>}
      </section>
    </main>
  );

  return (
    <main className="game-shell">
      <div className="online-layout">
        <section className="game-card">
          <div className="topbar">
            <Link className="back-link" to="/tictactoe">← Exit</Link>
            <div className="room-code">ROOM <strong>{roomId}</strong></div>
          </div>
          <div className="players">
            <div className={symbol === 'X' ? 'player active' : 'player'}><b>✕</b><span>{players.find(p=>p.symbol==='X')?.name || 'Player 1'}</span></div>
            <div className="vs">VS</div>
            <div className={symbol === 'O' ? 'player active' : 'player'}><b>○</b><span>{players.find(p=>p.symbol==='O')?.name || 'Waiting…'}</span></div>
          </div>
          <div className="status">{status}</div>
          <div className="online-board">
            {board.map((square, i) => (
              <button key={i} className={square === 'X' ? 'cell x' : square === 'O' ? 'cell o' : 'cell'} onClick={() => move(i)} disabled={!myTurn || !!square}>
                {square === 'X' ? '✕' : square === 'O' ? '○' : ''}
              </button>
            ))}
          </div>
          {phase === 'finished' && <button className="primary-btn wide" onClick={rematch}>Play Again</button>}
          {error && <div className="error-box">{error}</div>}
          <VoiceChat socket={socket} roomId={roomId} players={players}/>
        </section>

        <aside className="chat-card">
          <div className="chat-header"><b>Live Chat</b><span>{players.length}/2 online</span></div>
          <div className="chat-messages" ref={chatRef}>
            {messages.length === 0 && <div className="muted chat-empty">Say hello to your opponent 👋</div>}
            {messages.map((m) => <div className="chat-message" key={m.id}><strong>{m.name}</strong><span>{m.text}</span></div>)}
          </div>
          <form className="chat-form" onSubmit={sendMessage}>
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message…" maxLength={300} />
            <button aria-label="Send message" type="submit">➤</button>
          </form>
        </aside>
      </div>
    </main>
  );
}
