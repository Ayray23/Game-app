import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const PLAYER_META = {
  red: { name: 'Red', color: '#ff5a75' },
  blue: { name: 'Blue', color: '#5aa9ff' },
  yellow: { name: 'Yellow', color: '#f7c948' },
  green: { name: 'Green', color: '#46d39a' },
};

const TRACK_CELLS = Array.from({ length: 52 }, (_, index) => {
  const angle = (index / 52) * Math.PI * 2 - Math.PI / 2;
  const radius = 4.8;
  const row = Math.round(7 + Math.sin(angle) * radius);
  const col = Math.round(7 + Math.cos(angle) * radius);
  return [row, col];
});

const START_INDEX = { red: 0, blue: 13, yellow: 26, green: 39 };
const SAFE_SQUARES = [0, 8, 13, 21, 26, 34, 39, 47];
const BASE_SLOTS = {
  red: [[1, 1], [1, 3], [3, 1], [3, 3]],
  blue: [[11, 1], [11, 3], [13, 1], [13, 3]],
  yellow: [[11, 11], [11, 13], [13, 11], [13, 13]],
  green: [[1, 11], [1, 13], [3, 11], [3, 13]],
};

const createPlayers = () =>
  Object.entries(PLAYER_META).map(([color, meta]) => ({
    color,
    name: meta.name,
    tokens: Array.from({ length: 4 }, (_, index) => ({
      id: `${color}-${index}`,
      position: -1,
      finished: false,
    })),
  }));

const getTrackPosition = (playerColor, position) => {
  if (position < 0 || position >= 52) return null;
  const offset = START_INDEX[playerColor];
  const index = (offset + position) % TRACK_CELLS.length;
  return TRACK_CELLS[index];
};

const getHomePosition = (playerColor, position) => {
  if (position < 52 || position > 57) return null;
  if (playerColor === 'red') return [6, 5 + (position - 52)];
  if (playerColor === 'blue') return [5 + (position - 52), 6];
  if (playerColor === 'yellow') return [8, 9 - (position - 52)];
  if (playerColor === 'green') return [9 - (position - 52), 8];
  return [7, 7];
};

const getTokenBoardCell = (playerColor, token) => {
  if (token.position === -1) {
    const slotIndex = Number(token.id.split('-')[1]);
    const slot = BASE_SLOTS[playerColor]?.[slotIndex];
    return slot ? { row: slot[0], col: slot[1] } : { row: 7, col: 7 };
  }

  if (token.position >= 0 && token.position < 52) {
    const [row, col] = getTrackPosition(playerColor, token.position) || [7, 7];
    return { row, col };
  }

  const [row, col] = getHomePosition(playerColor, token.position) || [7, 7];
  return { row, col };
};

const getLegalMoves = (player, value) => {
  if (value === null) return [];

  return player.tokens
    .filter((token) => !token.finished)
    .filter((token) => {
      if (token.position === -1) return value === 6;
      return token.position + value <= 57;
    })
    .map((token) => token.id);
};

const getCellTone = (row, col) => {
  if (row <= 4 && col <= 4) return 'home-red';
  if (row <= 4 && col >= 10) return 'home-blue';
  if (row >= 10 && col <= 4) return 'home-green';
  if (row >= 10 && col >= 10) return 'home-yellow';
  if (row >= 5 && row <= 9 && col >= 5 && col <= 9) return 'center';
  return 'track';
};

export default function Ludo() {
  const [players, setPlayers] = useState(createPlayers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dice, setDice] = useState(null);
  const [status, setStatus] = useState('Roll the dice to begin.');
  const [winner, setWinner] = useState(null);

  const activePlayer = players[currentIndex];
  const legalMoves = useMemo(() => getLegalMoves(activePlayer, dice), [activePlayer, dice]);

  const boardCells = useMemo(() => {
    const cells = [];

    for (let row = 0; row < 15; row += 1) {
      for (let col = 0; col < 15; col += 1) {
        const tone = getCellTone(row, col);
        const tokens = players.flatMap((player) =>
          player.tokens
            .filter((token) => !token.finished)
            .map((token) => ({ token, board: getTokenBoardCell(player.color, token) }))
            .filter((entry) => entry.board && entry.board.row === row && entry.board.col === col)
            .map((entry) => ({
              color: player.color,
              id: entry.token.id,
              name: player.name,
            }))
        );

        cells.push({ row, col, tone, tokens });
      }
    }

    return cells;
  }, [players]);

  const moveToken = (tokenId) => {
    if (dice === null || winner) return;

    const token = activePlayer.tokens.find((item) => item.id === tokenId);
    if (!token || !legalMoves.includes(tokenId)) return;

    let nextPosition = token.position;

    if (token.position === -1) {
      nextPosition = 0;
    } else {
      nextPosition = token.position + dice;
      if (nextPosition > 57) return;
    }

    const nextPlayers = players.map((player, index) => {
      if (index !== currentIndex) return player;
      return {
        ...player,
        tokens: player.tokens.map((item) => {
          if (item.id !== tokenId) return item;
          return {
            ...item,
            position: nextPosition,
            finished: nextPosition === 57,
          };
        }),
      };
    });

    const targetCell = getTokenBoardCell(activePlayer.color, { position: nextPosition, id: tokenId });
    if (targetCell) {
      for (const player of nextPlayers) {
        if (player.color === activePlayer.color) continue;
        for (const item of player.tokens) {
          if (item.finished || item.position < 0 || item.position >= 52) continue;
          const enemyCell = getTokenBoardCell(player.color, item);
          if (enemyCell && enemyCell.row === targetCell.row && enemyCell.col === targetCell.col) {
            const targetIndex = nextPosition % 52;
            const safeHit = SAFE_SQUARES.includes(targetIndex);
            if (!safeHit) {
              item.position = -1;
            }
          }
        }
      }
    }

    const finalPlayers = nextPlayers.map((player) => ({
      ...player,
      tokens: player.tokens.map((tokenItem) => ({
        ...tokenItem,
        finished: tokenItem.position === 57,
      })),
    }));

    const winnerMatch = finalPlayers.find((player) => player.tokens.every((token) => token.finished));

    if (winnerMatch) {
      setPlayers(finalPlayers);
      setWinner(winnerMatch.color);
      setDice(null);
      setStatus(`${winnerMatch.name} wins the round!`);
      return;
    }

    setPlayers(finalPlayers);
    setDice(null);

    if (dice === 6) {
      setStatus(`${activePlayer.name} rolled a 6 and plays again.`);
      return;
    }

    const nextIndex = (currentIndex + 1) % players.length;
    setCurrentIndex(nextIndex);
    setStatus(`${players[nextIndex].name} is up next.`);
  };

  const rollDice = () => {
    if (dice !== null || winner) return;

    const rolled = Math.ceil(Math.random() * 6);
    const legal = getLegalMoves(activePlayer, rolled);
    setDice(rolled);

    if (!legal.length) {
      setStatus(`${activePlayer.name} rolled a ${rolled}, but no token can move.`);
      setTimeout(() => {
        setDice(null);
        if (rolled !== 6) {
          const nextIndex = (currentIndex + 1) % players.length;
          setCurrentIndex(nextIndex);
          setStatus(`${players[nextIndex].name} is up next.`);
        } else {
          setStatus(`${activePlayer.name} rolled a 6 and keeps the turn.`);
        }
      }, 700);
      return;
    }

    setStatus(`${activePlayer.name} rolled a ${rolled}. Choose a token to move.`);
  };

  return (
    <main className="game-shell game-shell-premium">
      <div className="ludo-modern-wrap">
        <section className="premium-game-card ludo-modern-card">
          <header className="ludo-modern-header">
            <div>
              <span className="eyebrow">CLASSIC BOARD GAME</span>
              <h1>Ludo</h1>
            </div>
            <Link className="back-link" to="/">
              ← Home
            </Link>
          </header>

          <div className="ludo-modern-layout">
            <div className="ludo-board-panel">
              <div className="ludo-board-grid">
                {boardCells.map(({ row, col, tone, tokens }) => (
                  <div key={`${row}-${col}`} className={`ludo-board-cell ${tone}`}>
                    {tokens.length > 0 && (
                      <div className="ludo-token-stack">
                        {tokens.map((token) => (
                          <span
                            key={`${token.color}-${token.id}`}
                            className={`ludo-token token-${token.color}`}
                            title={token.name}
                          >
                            ●
                          </span>
                        ))}
                      </div>
                    )}
                    {row === 7 && col === 7 && <span className="ludo-center-mark">✦</span>}
                  </div>
                ))}
              </div>
            </div>

            <aside className="ludo-side-panel">
              <div className="ludo-scoreboard">
                <div className="scoreboard-head">
                  <span className="eyebrow">SCOREBOARD</span>
                  <strong>{winner ? 'Finished' : 'Live'}</strong>
                </div>

                {players.map((player, index) => (
                  <div
                    key={player.color}
                    className={`score-row ${index === currentIndex ? 'is-active' : ''} ${winner === player.color ? 'is-winner' : ''}`}
                  >
                    <span className="score-color" style={{ background: PLAYER_META[player.color].color }} />
                    <div>
                      <b>{player.name}</b>
                      <small>{player.tokens.filter((token) => token.finished).length}/4 home</small>
                    </div>
                    <strong>{player.tokens.filter((token) => token.finished).length}</strong>
                  </div>
                ))}
              </div>

              <div className="dice-panel">
                <div className={`dice-box ${dice !== null ? 'rolled' : ''}`}>{dice ?? '?'}</div>
                <button className="primary-btn" disabled={dice !== null || Boolean(winner)} onClick={rollDice}>
                  {dice === null ? 'Roll Dice' : 'Rolled'}
                </button>
              </div>

              <div className="move-panel">
                <div className="move-header">
                  <span className="eyebrow">PLAYER TURN</span>
                  <strong>{activePlayer.name}</strong>
                </div>

                <div className="move-token-row">
                  {activePlayer.tokens.map((token) => {
                    const isAvailable = legalMoves.includes(token.id);
                    const label = token.position === -1 ? 'Base' : token.finished ? 'Home' : `P${token.position}`;

                    return (
                      <button
                        key={token.id}
                        className={`token-button token-${activePlayer.color} ${isAvailable ? 'is-move' : ''}`}
                        disabled={dice === null || !isAvailable || Boolean(winner)}
                        onClick={() => moveToken(token.id)}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="status-box">{status}</div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
