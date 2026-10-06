import React from 'react';
import { Link } from 'react-router-dom';

const games = [
  { to:'/ludo', title:'Ludo', subtitle:'Classic · Multiplayer', tone:'green', art:'ludo' },
  { to:'/connect-four', title:'Connect Four', subtitle:'Strategy · Multiplayer', tone:'blue', art:'connect4' },
  { to:'/battleship', title:'Battleship', subtitle:'Tactical · Multiplayer', tone:'cyan', art:'battleship' },
  { to:'/tictactoeonline', title:'Tic-Tac-Toe', subtitle:'Fast · Multiplayer', tone:'purple', art:'ttt' },
];

function GameArt({ type }) {
  if (type === 'ludo') return (
    <div className="hub-art hub-art-ludo" aria-hidden="true">
      <div className="art-die die-one">5</div><div className="art-die die-two">3</div>
      <i className="pawn pawn-red">●</i><i className="pawn pawn-green">●</i><i className="pawn pawn-blue">●</i>
    </div>
  );

  if (type === 'connect4') return (
    <div className="hub-art hub-art-connect4" aria-hidden="true">
      <div className="connect-art-grid">{Array.from({length:42},(_,i)=><i key={i} className={i%9===0?'yellow':i%7===0?'red':''}/>)}</div>
    </div>
  );

  if (type === 'battleship') return (
    <div className="hub-art hub-art-battleship" aria-hidden="true">
      <span className="ship-silhouette">⚓</span><span className="ship-line ship-line-a"/><span className="ship-line ship-line-b"/>
    </div>
  );

  return (
    <div className="hub-art hub-art-ttt" aria-hidden="true">
      <span>×</span><span>○</span><span>×</span><span>○</span><span>×</span><span>○</span><span>×</span><span>○</span><span>×</span>
    </div>
  );
}

function TttPreview(){
  const cells=['×','○','×','○','×','○','×','○','×'];
  return <div className="preview-ttt">{cells.map((x,i)=><span key={i} className={x==='×'?'x':''}>{x}</span>)}</div>;
}
function ConnectPreview(){
  return <div className="preview-connect">{Array.from({length:42},(_,i)=><i key={i} className={[3,10,11,17,18,19,24,25,26,27,32,33,34,40].includes(i)?'red':[4,5,12,13,20,21,28,29,35,36].includes(i)?'yellow':''}/>)}</div>;
}
function LudoPreview(){
  return <div className="preview-ludo"><div className="lp lp-red">●</div><div className="lp lp-green">●</div><div className="lp lp-blue">●</div><div className="lp lp-yellow">●</div><div className="lp-center">◆</div></div>;
}
function BattlePreview(){
  return <div className="preview-battle">{Array.from({length:100},(_,i)=><i key={i} className={[12,13,14,15,25,35,55,65,66,67,68,69,70].includes(i)?'ship':[4,18,43,76,88].includes(i)?'hit':[8,29,58,91].includes(i)?'miss':''}/>)}</div>;
}

function PreviewCard({title,subtitle,type,children,tone}){
  return <article className={'preview-card '+tone}>
    <div className="preview-heading"><div><b>{title}</b><small>{subtitle}</small></div><span className="preview-live">● LIVE</span></div>
    <div className="preview-score"><span><i className="avatar avatar-red">R</i> Raymond <strong>3</strong></span><em>Round 4</em><span>John <strong>1</strong> <i className="avatar avatar-gold">J</i></span></div>
    {children}
    <div className="preview-turn">ϟ <b>Your Turn</b><small>Make your move</small></div>
    <div className="preview-chat"><span>◌</span><div>Type a message...</div><b>➤</b></div>
  </article>;
}

export default function Mainmenu(){
  return (
    <main className="hub-page">
      <div className="hub-noise" />
      <div className="hub-dashboard">
        <aside className="hub-sidebar">
          <div className="brand">
            <div className="brand-mark">⌁</div>
            <div><strong>GameHub</strong><small>Play · Connect · Compete</small></div>
          </div>
          <nav className="hub-nav">
            <a className="active" href="#home"><span>⌂</span>Home</a>
            <a href="#games"><span>ϟ</span>Quick Play</a>
            <a href="#rooms"><span>♧</span>Rooms</a>
            <a href="#leaderboard"><span>♜</span>Leaderboard</a>
            <a href="#settings"><span>⚙</span>Settings</a>
          </nav>
          <div className="sidebar-profile">
            <div className="profile-avatar">R</div>
            <div><b>Raymond</b><small><i/> Online</small></div>
            <span>⌄</span>
          </div>
        </aside>

        <section className="hub-main" id="home">
          <header className="hub-header">
            <div><h1>Welcome back, Raymond!</h1><p>Good games. Better company.</p></div>
            <div className="header-actions"><button aria-label="Notifications">♧</button><button aria-label="Voice">♩</button><div className="header-avatar">R<i/></div></div>
          </header>

          <section className="hub-hero">
            <div className="hero-art">
              <span className="hero-pawn hero-pawn-a">●</span><span className="hero-pawn hero-pawn-b">●</span>
              <span className="hero-die">5</span><span className="hero-die hero-die-two">4</span><span className="hero-die hero-die-three">6</span>
              <b>♛</b>
            </div>
            <div className="hero-copy"><h2>Play. Compete. Have Fun.</h2><p>Choose a game and challenge your friends<br/>in real-time multiplayer battles.</p></div>
            <div className="hero-online"><span><i/> Online Now</span><strong>12,486 <small>players</small></strong><div className="mini-avatars"><i>R</i><i>J</i><i>A</i><i>M</i><i>+</i></div><b>›</b></div>
          </section>

          <section className="featured-games" id="games">
            {games.map(game=>(
              <Link key={game.to} to={game.to} className={'featured-game '+game.tone}>
                <GameArt type={game.art}/>
                <div className="game-copy"><h3>{game.title}</h3><p>{game.subtitle}</p></div>
                <span className="game-play">Play <b>›</b></span>
              </Link>
            ))}
          </section>

          <section className="hub-previews">
            <PreviewCard title="Tic-Tac-Toe Online" subtitle="Clean. Focused. Competitive." tone="preview-blue"><TttPreview/></PreviewCard>
            <PreviewCard title="Connect Four Online" subtitle="Strategy. 4 in a row." tone="preview-red"><ConnectPreview/></PreviewCard>
            <PreviewCard title="Ludo Online" subtitle="Roll. Move. Win." tone="preview-green"><LudoPreview/></PreviewCard>
            <PreviewCard title="Battleship Online" subtitle="Find. Hit. Sink." tone="preview-cyan"><BattlePreview/></PreviewCard>
          </section>
        </section>

        <aside className="hub-rail">
          <section className="rail-card features-card">
            <h2>Key Features in This Design</h2>
            <div className="feature-item"><i className="feature-icon blue">▣</i><div><b>Match System</b><p>No more “Play Again” after every round. Keep playing until the match ends.</p></div></div>
            <div className="feature-item"><i className="feature-icon green">♧</i><div><b>Scoreboard</b><p>Track round wins and match progress in real time.</p></div></div>
            <div className="feature-item"><i className="feature-icon gold">□</i><div><b>Floating Notifications</b><p>Important events show as overlay and disappear automatically.</p></div></div>
            <div className="feature-item"><i className="feature-icon purple">♧</i><div><b>Chat & Voice</b><p>Compact, non-intrusive UI. Keep the focus on the game.</p></div></div>
            <div className="feature-item"><i className="feature-icon violet">⌁</i><div><b>Modern Dark Theme</b><p>Clean, immersive, and responsive across all devices.</p></div></div>
          </section>

          <section className="activity-stack">
            <div className="activity green"><b>♟ John joined the room</b><small>2s ago</small></div>
            <div className="activity blue"><b>ϟ It's your turn!</b><small>Make your move <span>2s ago</span></small></div>
            <div className="activity purple"><b>♧ John hit your ship!</b><small>Battleship <span>2s ago</span></small></div>
            <div className="activity gold"><b>♛ You won the round!</b><small>+1 point <span>2s ago</span></small></div>
          </section>

          <section className="voice-card">
            <div className="voice-title"><span>♩</span><div><b>Voice Chat</b><small>John is speaking...</small></div><button>◖</button></div>
            <div className="voice-wave"><span>♩</span><i/><i/><i/><i/><i/><i/><i/><i/><i/><b>⌁</b></div>
          </section>

          <section className="mobile-section">
            <h2>Mobile Responsive</h2><p>Same great experience. Anywhere.</p>
            <div className="phone">
              <div className="phone-top"><b>⌁ GameHub</b><span>☰</span></div>
              <div className="phone-game"><small>🎲 Ludo</small><span>Multiplayer · Classic</span><b>Play <i>›</i></b></div>
              <div className="phone-turn">ϟ <b>Your turn!</b><small>Make your move <em>2s</em></small></div>
              <div className="phone-score"><span>🔴 Raymond <b>3</b></span><span>John <b>1</b> 🟡</span></div>
              <div className="phone-ludo"><div>●</div><div>●</div><div>◆</div><div>●</div></div>
              <div className="phone-nav"><span>⌂<small>Home</small></span><span>□<small>Chat</small></span><span>♩<small>Voice</small></span><span>⋮<small>More</small></span></div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
