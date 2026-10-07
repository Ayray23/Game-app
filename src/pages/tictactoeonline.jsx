import React,{useEffect,useRef,useState}from'react';
import{io}from'socket.io-client';
import{useNavigate}from'react-router-dom';
import{sounds}from'../lib/audio';
import VoiceChat from'../component/VoiceChat';
import GameHUD from'../component/GameHUD';import{auth}from'../firebase';

const SOCKET_URL=import.meta.env.DEV?'http://localhost:5000':(import.meta.env.VITE_SOCKET_URL||'https://game-server-1-sxiw.onrender.com');
const socket=io(SOCKET_URL,{autoConnect:false});
const makeCode=()=>Math.random().toString(36).slice(2,8).toUpperCase(),queryRoom=new URLSearchParams(window.location.search).get('room')?.trim().toUpperCase()||'';

export default function TictactoeOnline(){
 const navigate=useNavigate();
 const[phase,setPhase]=useState('setup'),[name,setName]=useState(''),[roomInput,setRoomInput]=useState(queryRoom),[roomId,setRoomId]=useState(''),[symbol,setSymbol]=useState(null),[board,setBoard]=useState(Array(9).fill(null)),[players,setPlayers]=useState([]),[turn,setTurn]=useState('X'),[status,setStatus]=useState('waiting'),[winner,setWinner]=useState(null),[draw,setDraw]=useState(false),[scores,setScores]=useState([]),[round,setRound]=useState(1),[error,setError]=useState(''),[messages,setMessages]=useState([]),[message,setMessage]=useState('');
 const chatRef=useRef(null),symbolRef=useRef(null);

 useEffect(()=>{
  const onCreated=({roomId:id,symbol:assigned})=>{setRoomId(id);symbolRef.current=assigned;setSymbol(assigned);setPhase('waiting');setStatus('waiting');setError('');sounds.join()};
  const onJoined=({roomId:id,symbol:assigned})=>{setRoomId(id);symbolRef.current=assigned;setSymbol(assigned);setPhase('game');setError('');sounds.join()};
  const onState=state=>{setRoomId(state.roomId||'');setBoard(Array.isArray(state.board)&&state.board.length===9?state.board:Array(9).fill(null));setTurn(state.currentTurn||'X');setPlayers(Array.isArray(state.players)?state.players:[]);setScores(Array.isArray(state.scores)?state.scores:[]);setRound(state.round||1);setWinner(Number.isInteger(state.winner)?state.winner:null);setDraw(!!state.draw);setStatus(state.status||'waiting');setPhase(state.status==='waiting'?'waiting':state.status==='finished'?'finished':'game')};
  const onChat=msg=>{setMessages(v=>[...v.slice(-49),msg]);sounds.message()};
  const onError=msg=>setError(msg);
  const onLeft=()=>{setPhase('waiting');setStatus('waiting');setPlayers([]);setBoard(Array(9).fill(null))};
  const autoJoin=()=>{const saved=localStorage.getItem('gamehub_name')||'';if(queryRoom&&saved)socket.emit('joinRoom',{roomId:queryRoom,name:saved.slice(0,20),game:'ttt'})};socket.on('connect',autoJoin);socket.on('roomCreated',onCreated);socket.on('roomJoined',onJoined);socket.on('game-state',onState);socket.on('chat-message',onChat);socket.on('errorMessage',onError);socket.on('playerLeft',onLeft);socket.connect();
  return()=>{socket.off('connect',autoJoin);socket.off('roomCreated',onCreated);socket.off('roomJoined',onJoined);socket.off('game-state',onState);socket.off('chat-message',onChat);socket.off('errorMessage',onError);socket.off('playerLeft',onLeft);socket.disconnect()};
 },[]);
 useEffect(()=>chatRef.current?.scrollTo({top:chatRef.current.scrollHeight,behavior:'smooth'}),[messages]);

 const enterName=name.trim().slice(0,20),meSlot=players.findIndex(p=>p.id===socket.id),myTurn=phase==='game'&&turn===symbol&&!winner&&!board.every(Boolean);
 const createRoom=()=>{if(!enterName)return setError('Enter your name first.');setError('');socket.emit('createRoom',{roomId:makeCode(),name:enterName,game:'ttt'})};
 const joinRoom=()=>{if(!enterName)return setError('Enter your name first.');if(!roomInput.trim())return setError('Enter a room code.');setError('');socket.emit('joinRoom',{roomId:roomInput.trim().toUpperCase(),name:enterName,game:'ttt'})};
 const move=index=>{if(!myTurn||board[index])return;sounds.move();socket.emit('make-move',{roomId,index})};
 const sendMessage=e=>{e.preventDefault();if(!message.trim()||!roomId)return;socket.emit('chat-message',{roomId,text:message});setMessage('')};

 if(phase==='setup')return <main className="game-shell"><section className="setup-card"><button className="back-link" onClick={()=>navigate('/tictactoe')}>← Back</button><div className="eyebrow">2 PLAYER ONLINE</div><h1>Tic Tac Toe</h1><p className="muted">Create a private room and play a continuous scored match.</p><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your display name" maxLength={20}/><div className="setup-actions"><button className="primary-btn" onClick={createRoom}>Create Room</button><div className="join-row"><input value={roomInput} onChange={e=>setRoomInput(e.target.value.toUpperCase())} placeholder="ROOM CODE" maxLength={8}/><button className="secondary-btn" onClick={joinRoom}>Join</button></div></div>{error&&<div className="error-box">{error}</div>}</section></main>;

 return <main className="game-shell"><div className="online-layout"><section className="game-card">
  <GameHUD title="Tic-Tac-Toe" roomId={roomId} players={players} scores={scores} round={round} meSlot={meSlot} status={status} winner={winner} draw={draw} notice={status==="waiting"?"Waiting for opponent…":status==="finished"?(draw?"Round draw":winner===meSlot?"Round won!":"Round lost"):turn===symbol?"Your turn":"Opponent’s turn"} onExit={()=>navigate('/tictactoe')}>
   <div className="players"><div className={symbol==='X'?'player active':'player'}><b>✕</b><span>{players.find(p=>p.symbol==='X')?.name||'Player 1'}</span></div><div className="vs">VS</div><div className={symbol==='O'?'player active':'player'}><b>○</b><span>{players.find(p=>p.symbol==='O')?.name||'Waiting…'}</span></div></div>
   <div className="status">{status==='waiting'?'Waiting for opponent…':status==='finished'?(draw?'Draw game':winner===meSlot?'Round won!':'Opponent won'):turn===symbol?'Your turn':'Opponent’s turn'}</div>
   <div className="game-board-surface"><div className="online-board">{board.map((square,i)=><button key={i} className={square==='X'?'cell x':square==='O'?'cell o':'cell'} onClick={()=>move(i)} disabled={!myTurn||!!square}>{square==='X'?'✕':square==='O'?'○':''}</button>)}</div></div>
   <VoiceChat socket={socket} roomId={roomId} players={players}/>
   {error&&<div className="error-box">{error}</div>}
  </GameHUD>
 </section><aside className="chat-card"><div className="chat-header"><b>Game Chat</b><span>{players.length}/2 online</span></div><div className="chat-messages" ref={chatRef}>{messages.length===0&&<div className="muted chat-empty">Keep the match friendly 👋</div>}{messages.map(m=><div className="chat-message" key={m.id}><strong>{m.name}</strong><span>{m.text}</span></div>)}</div><form className="chat-form" onSubmit={sendMessage}><input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Type a message…" maxLength={300}/><button aria-label="Send message" type="submit">➤</button></form></aside></div></main>;
}