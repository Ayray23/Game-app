import React,{useEffect,useState}from'react';

export default function GameHUD({title,roomId,players=[],scores=[],round=1,meSlot,status,winner,draw,onExit,notice,children}){
 const [toast,setToast]=useState('');
 useEffect(()=>{
  let text=notice||'';
  if(!text&&status==='waiting') text='Waiting for opponent';
  else if(!text&&status==='playing') text='Match in progress';
  else if(!text&&status==='finished') text=winner===meSlot?'You won the round!':winner===null?'Round draw':'Round complete';
  if(text){setToast(text);const t=setTimeout(()=>setToast(''),2500);return()=>clearTimeout(t)}
 },[status,winner,meSlot,round]);
 return <>
  <div className={'game-toast '+(toast?'show':'')}><b>{toast}</b><span>{roomId?'Live match · '+roomId:'Live match'}</span></div>
  <div className="topbar"><button className="back-link" onClick={onExit}>← Exit</button><div><b>{title}</b><div className="room-code">ROOM <strong>{roomId}</strong></div></div><div className="round-chip">ROUND {round}</div></div>
  <div className="score-strip">
   {players.map((p,i)=><div className={'score-chip '+(i===meSlot?'active':'')} key={p.id||i}>{p.name}{i===meSlot?' · YOU':''}<strong>{scores[i]||0}</strong></div>)}
  </div>
  {children}
  {status==='finished'&&<RoundOverlay players={players} scores={scores} meSlot={meSlot} winner={winner} draw={draw} round={round}/>}
 </>;
}

function RoundOverlay({players,scores,meSlot,winner,draw,round}){
 const [count,setCount]=useState(3);
 useEffect(()=>{const id=setInterval(()=>setCount(v=>v>1?v-1:1),1000);const end=setTimeout(()=>clearInterval(id),3300);return()=>{clearInterval(id);clearTimeout(end)}},[]);
 const winName=winner===null?'Draw':players[winner]?.name||'Winner';
 return <div className="match-overlay"><div className="match-panel">
  <div className="match-kicker">Round {round} complete</div>
  <h2>{draw?'DRAW GAME':'🏆 '+(winner===meSlot?'ROUND WON':'ROUND LOST')}</h2>
  <div className="match-score">
   {players.slice(0,2).map((p,i)=><React.Fragment key={p.id||i}>{i===1&&<div className="match-vs">VS</div>}<div className="match-player"><strong>{scores[i]||0}</strong><span>{p.name}{i===meSlot?' · You':''}</span></div></React.Fragment>)}
  </div>
  {players.length>2&&<div className="match-round">{players.map((p,i)=><span key={p.id||i}>{p.name}: {scores[i]||0} · </span>)}</div>}
  <div className="countdown">Next round starts in<b>{count}</b></div>
  <div className="match-round">{winName} {winner===null?'': 'takes the round.'}</div>
 </div></div>
}
