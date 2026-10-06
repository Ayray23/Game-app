import React from'react';
import{Link}from'react-router-dom';

const games=[
 ['/ludo','🎲','Ludo','2–4 players','green','Roll · Move · Win'],
 ['/connect-four','🔴','Connect Four','2 players','blue','Strategy · Four in a row'],
 ['/battleship','⚓','Battleship','2 players','orange','Find · Hit · Sink'],
 ['/tictactoeonline','✕○','Tic-Tac-Toe','2 players','purple','Fast · Strategic · Addictive'],
];
const extras=[['/hexa-fall','◈','Pokemon Memory','Solo challenge'],['/wordquiz','✍️','Word Quiz','Quick challenge']];

export default function Mainmenu(){
 return <main className="game-shell"><section className="hub-card">
  <div className="eyebrow">REAL-TIME MULTIPLAYER ARCADE</div>
  <h1>Play. Compete.<br/><span style={{color:'#8ea2ff'}}>Have Fun.</span></h1>
  <p className="muted" style={{maxWidth:620,fontSize:16}}>Create a private room, invite your friends, and keep the match going round after round.</p>
  <div className="game-grid">{games.map(([to,icon,title,players,color,tag])=><Link to={to} className={'game-tile '+color} key={to}><span>{icon}</span><b>{title}</b><small>{players} · {tag}</small><div style={{marginTop:16}}><span style={{fontSize:12,margin:0,color:'#aebaff'}}>Play now →</span></div></Link>)}</div>
  <div className="feature-row"><span>⚡ Live rooms</span><span>🏆 Persistent match scores</span><span>🔔 Floating notifications</span><span>💬 Chat + 🎙 Voice</span><span>↻ Auto next round</span></div>
  <div style={{marginTop:32,paddingTop:20,borderTop:'1px solid rgba(255,255,255,.07)'}}>
   <div className="eyebrow">MORE GAMES</div>
   <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:10,marginTop:12}}>{extras.map(([to,icon,title,desc])=><Link key={to} to={to} className="game-tile purple" style={{minHeight:110,padding:16}}><span style={{fontSize:30}}>{icon}</span><b style={{fontSize:15}}>{title}</b><small>{desc}</small></Link>)}</div>
  </div>
 </section></main>
}