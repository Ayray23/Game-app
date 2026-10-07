import React,{useEffect,useRef,useState}from"react";
import{io}from"socket.io-client";
import{Link}from"react-router-dom";
import VoiceChat from"../component/VoiceChat";
import GameHUD from"../component/GameHUD";
import{auth}from"../firebase";
import LudoBoard from"./LudoBoard";

const COLORS={red:"#E24B4A",green:"#639922",yellow:"#EF9F27",blue:"#378ADD"};
const OFF={red:0,blue:13,green:26,yellow:39};
const HC={red:[1,2,3,4,5].map(x=>[x,7]),green:[1,2,3,4,5].map(y=>[7,y]),yellow:[13,12,11,10,9].map(x=>[x,7]),blue:[13,12,11,10,9].map(y=>[7,y])};
const BASE={red:[0,0],green:[360,0],yellow:[360,360],blue:[0,360]};
const SPOT=[[75,75],[165,75],[75,165],[165,165]];
const DIR={red:[-1,0],green:[0,-1],yellow:[1,0],blue:[0,1]};
const T=[];
for(let c=1;c<=5;c++)T.push([c,6]);
for(let r=5;r>=0;r--)T.push([6,r]);
T.push([7,0],[8,0]);
for(let r=1;r<=5;r++)T.push([8,r]);
for(let c=9;c<=14;c++)T.push([c,6]);
T.push([14,7],[14,8]);
for(let c=13;c>=9;c--)T.push([c,8]);
for(let r=9;r<=14;r++)T.push([8,r]);
T.push([7,14],[6,14]);
for(let r=13;r>=9;r--)T.push([6,r]);
for(let c=5;c>=0;c--)T.push([c,8]);
T.push([0,7],[0,6]);

function xy(c,i,p){
 if(p<0)return[BASE[c][0]+SPOT[i][0],BASE[c][1]+SPOT[i][1]];
 if(p<=50){const[col,row]=T[(OFF[c]+p)%52];return[col*40+20,row*40+20]}
 if(p<56){const[col,row]=HC[c][p-51];return[col*40+20,row*40+20]}
 const d=DIR[c],k=(i-1.5)*14;
 return[300+d[0]*50+Math.abs(d[1])*k,300+d[1]*50+Math.abs(d[0])*k];
}
const PIPS={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]};
const queryRoom=new URLSearchParams(window.location.search).get("room")?.trim().toUpperCase()||"";
const code=()=>Math.random().toString(36).slice(2,8).toUpperCase();
const URL=import.meta.env.DEV?"http://localhost:5000":(import.meta.env.VITE_SOCKET_URL||"https://game-server-1-sxiw.onrender.com");
const socket=io(URL,{autoConnect:false});

export default function Ludo(){
 const[phase,setPhase]=useState("setup"),[name,setName]=useState(""),[room,setRoom]=useState(queryRoom),[id,setId]=useState(""),[players,setPlayers]=useState([]),[turn,setTurn]=useState(0),[dice,setDice]=useState(null),[rolledBy,setRolledBy]=useState(null),[winner,setWinner]=useState(null),[scores,setScores]=useState([]),[round,setRound]=useState(1),[error,setError]=useState(""),[messages,setMessages]=useState([]),[msg,setMsg]=useState(""),[face,setFace]=useState(1);
 const chat=useRef(null);
 const me=players.find(p=>p.id===socket.id);
 const mine=me?.slot;

 useEffect(()=>{
  const state=x=>{setId(x.roomId);setPlayers(x.players||[]);setTurn(x.currentTurn);setDice(x.dice);setRolledBy(x.rolledBy);setWinner(x.winner);setScores(x.scores||[]);setRound(x.round||1);setPhase(x.status==="waiting"?"waiting":x.status==="finished"?"finished":"game");if(x.dice!=null)setFace(x.dice)};
  const auto=()=>{const saved=localStorage.getItem("gamehub_name")||auth?.currentUser?.displayName||auth?.currentUser?.email?.split("@")[0]||"";if(queryRoom&&saved)socket.emit("joinRoom",{roomId:queryRoom,name:saved.slice(0,20),game:"ludo"})};
  socket.on("connect",auto);socket.on("game-state",state);socket.on("roomCreated",x=>setId(x.roomId));socket.on("roomJoined",x=>setId(x.roomId));socket.on("errorMessage",setError);socket.on("playerLeft",()=>{setPhase("waiting");setPlayers([]);setWinner(null);setDice(null);setRolledBy(null)});socket.on("chat-message",x=>setMessages(v=>[...v.slice(-49),x]));
  (async()=>{let token=null;try{token=await auth?.currentUser?.getIdToken?.()||null}catch{}socket.auth=token?{token}:{};socket.connect()})();
  return()=>{socket.off("connect",auto);socket.disconnect()};
 },[]);
 useEffect(()=>chat.current?.scrollTo({top:chat.current.scrollHeight}),[messages]);

 const enter=name.trim();
 const create=()=>{if(!enter)return setError("Enter your name.");localStorage.setItem("gamehub_name",enter);socket.emit("createRoom",{roomId:code(),name:enter,game:"ludo"})};
 const join=()=>{if(!enter||!room.trim())return setError("Enter your name and room code.");localStorage.setItem("gamehub_name",enter);socket.emit("joinRoom",{roomId:room.trim().toUpperCase(),name:enter,game:"ludo"})};
 const act=(action,payload={})=>socket.emit("game-action",{roomId:id,action,payload});
 const roll=()=>{if(mine!==turn||dice!==null||winner!==null||phase!=="game")return;let n=0;const timer=setInterval(()=>{n++;setFace(1+Math.floor(Math.random()*6));if(n>=8)clearInterval(timer)},70);act("roll")};
 const send=e=>{e.preventDefault();if(msg.trim())socket.emit("chat-message",{roomId:id,text:msg});setMsg("")};
 const movable=(p,i)=>{if(dice==null||rolledBy!==mine||turn!==mine)return false;const pos=p.tokens?.[i];return Number.isInteger(pos)&&pos!==56&&(pos===-1?dice===6:pos+dice<=56)};

 if(phase==="setup")return <main className="game-shell"><section className="setup-card game-setup ludo-setup"><Link className="back-link" to="/">← Arcade</Link><div className="eyebrow">CLASSIC MULTIPLAYER</div><div className="setup-emblem ludo-emblem">◆</div><h1>Ludo</h1><p className="muted">A real-time race around the board. Roll smart, capture opponents and bring every token home.</p><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your display name" maxLength={20}/><div className="setup-actions"><button className="primary-btn" onClick={create}>Create Match <span>→</span></button><div className="join-row"><input value={room} onChange={e=>setRoom(e.target.value.toUpperCase())} placeholder="ROOM CODE"/><button className="secondary-btn" onClick={join}>Join</button></div></div>{error&&<div className="error-box">{error}</div>}</section></main>;

 const items=[];
 players.forEach(p=>(p.tokens||[]).forEach((pos,i)=>{const can=p.id===socket.id&&movable(p,i);items.push({c:p.color,i,p:pos,can,posxy:xy(p.color,i,pos)})}));
 const groups={};
 items.forEach(o=>{const k=o.posxy.join();(groups[k]=groups[k]||[]).push(o)});
 items.forEach(o=>{const g=groups[o.posxy.join()];o.n=g.length;o.dx=o.p>=0&&o.p<56?(g.indexOf(o)-(g.length-1)/2)*11:0});
 items.sort((a,b)=>Number(a.can)-Number(b.can));
 const winnerName=players.find(p=>p.slot===winner)?.name||"Player";
 const status=winner!==null?winnerName+" wins the round!":phase==="waiting"?"Waiting for another player…":phase==="finished"?"Round complete":turn===mine?"Your turn — roll the dice":"Opponent's turn";
 const canRoll=mine===turn&&dice===null&&winner===null&&phase==="game";

 return <main className="game-shell game-shell-premium"><div className="online-layout"><section className="game-card premium-game-card"><GameHUD title="Ludo" roomId={id} players={players} scores={scores} round={round} meSlot={mine} status={phase==="finished"?"finished":phase==="waiting"?"waiting":"playing"} winner={winner} draw={false} notice={status} onExit={()=>window.location.href="/"}><div className="ludo-meta"><div><span className="eyebrow">LIVE BOARD</span><h1>Ludo Arena</h1></div><div className="ludo-turn"><i/><span>{turn===mine?"YOUR TURN":"OPPONENT TURN"}</span></div></div><div className="ludo-arena"><div className="ludo-board-grid ludo-svg-wrap"><LudoBoard size="100%" maxWidth={640}>{items.map(({c,i,can,posxy,n,dx,p})=>{const r=p===56?9:n>1?10:13;const x=posxy[0]+dx,y=posxy[1];return <g key={c+i} onClick={()=>can&&act("move",{token:i})} style={{cursor:can?"pointer":"default"}}>{can&&<circle cx={x} cy={y} r={r+4} fill="none" stroke="#2C2C2A" strokeWidth="2"><animate attributeName="r" values={r+3+";"+(r+7)+";"+(r+3)} dur="0.9s" repeatCount="indefinite"/></circle>}<circle cx={x} cy={y} r={r} fill={COLORS[c]} stroke="#fff" strokeWidth="2.5"/><circle cx={x} cy={y} r={Math.max(r-6,2)} fill="#fff" fillOpacity="0.35"/>{p===56&&<text x={x} y={y+4} textAnchor="middle" fontSize="10" fill="#fff">★</text>}</g>})}<g onClick={roll} style={{cursor:canRoll?"pointer":"default"}}><rect x="270" y="270" width="60" height="60" rx="12" fill="#fff" stroke={COLORS[players.find(p=>p.slot===turn)?.color||"red"]} strokeWidth="4">{canRoll&&<animate attributeName="stroke-width" values="3;7;3" dur="1s" repeatCount="indefinite"/>}</rect>{PIPS[face].map(([px,py],k)=><circle key={k} cx={300+px*15} cy={300+py*15} r="5" fill="#2C2C2A"/>)}</g></LudoBoard></div></div><div className="ludo-controls"><div className="ludo-player-strip">{players.map(p=><div className={"ludo-player "+(p.slot===turn?"active":"")} key={p.id}><i className={"dot "+p.color}/><span>{p.name}</span><b>{(p.tokens||[]).filter(x=>x===56).length}/4</b></div>)}</div><div className="dice-panel"><div className={"dice dice-large "+(dice?"rolled":"")}><span>{dice??face}</span></div><button className="primary-btn" disabled={!canRoll} onClick={roll}>{dice?"Choose token":"Roll Dice"} <span>→</span></button></div></div><div className="ludo-token-tray">{players.filter(p=>p.id===socket.id).map(p=><div className="token-tray-player" key={p.id}><span className="eyebrow">YOUR TOKENS</span><div>{(p.tokens||[]).map((pos,i)=><button key={i} className={"home-token "+p.color+(pos===56?" finished":"")} disabled={!movable(p,i)} onClick={()=>act("move",{token:i})}>{pos===56?"★":pos===-1?"HOME":pos}</button>)}</div></div>)}</div><div className="ludo-help">Roll <b>6</b> to enter. Select a token after a roll. Reach <b>56</b> to finish.</div><VoiceChat socket={socket} roomId={id} players={players}/>{error&&<div className="error-box">{error}</div>}</GameHUD></section><aside className="chat-card premium-chat"><div className="chat-header"><div><span className="eyebrow">MATCH CHAT</span><b>Live room</b></div><span>{players.length}/4</span></div><div className="chat-messages" ref={chat}>{messages.length===0&&<div className="chat-empty">Good luck. Keep it competitive. 🎲</div>}{messages.map(m=><div className="chat-message" key={m.id}><strong>{m.name}</strong><span>{m.text}</span></div>)}</div><form className="chat-form" onSubmit={send}><input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Message…" maxLength={300}/><button type="submit">↗</button></form></aside></div></main>;
}
