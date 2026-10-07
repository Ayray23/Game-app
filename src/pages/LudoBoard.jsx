import React from "react";

const CELL = 40;
const GRID = 15;
const BOARD = CELL * GRID;

const COLORS = {
  red: "#E24B4A",
  green: "#639922",
  yellow: "#EF9F27",
  blue: "#378ADD",
};
const LINE = "#5F5E5A";
const WHITE = "#ffffff";

const BASES = [
  { color: "red", col: 0, row: 0 },
  { color: "green", col: 9, row: 0 },
  { color: "yellow", col: 9, row: 9 },
  { color: "blue", col: 0, row: 9 },
];

const ARMS = [
  { col: 0, row: 6, w: 6, h: 3 },
  { col: 9, row: 6, w: 6, h: 3 },
  { col: 6, row: 0, w: 3, h: 6 },
  { col: 6, row: 9, w: 3, h: 6 },
];

const HOME_COLUMNS = [
  { color: "red", col: 1, row: 7, w: 5, h: 1 },
  { color: "green", col: 7, row: 1, w: 1, h: 5 },
  { color: "yellow", col: 9, row: 7, w: 5, h: 1 },
  { color: "blue", col: 7, row: 9, w: 1, h: 5 },
];

const STARTS = [
  { color: "red", col: 1, row: 6 },
  { color: "green", col: 8, row: 1 },
  { color: "yellow", col: 13, row: 8 },
  { color: "blue", col: 6, row: 13 },
];

const SAFE = [
  { col: 2, row: 8 },
  { col: 6, row: 2 },
  { col: 12, row: 6 },
  { col: 8, row: 12 },
];

const C0 = 6 * CELL;
const C1 = 9 * CELL;
const CM = 7.5 * CELL;
const TRIANGLES = [
  { color: "green", points: `${C0},${C0} ${C1},${C0} ${CM},${CM}` },
  { color: "yellow", points: `${C1},${C0} ${C1},${C1} ${CM},${CM}` },
  { color: "blue", points: `${C1},${C1} ${C0},${C1} ${CM},${CM}` },
  { color: "red", points: `${C0},${C1} ${C0},${C0} ${CM},${CM}` },
];

function Cells({ col, row, w, h, fill }) {
  const cells = [];
  for (let r = 0; r < h; r += 1) {
    for (let c = 0; c < w; c += 1) {
      cells.push(
        <rect
          key={`${col + c}-${row + r}`}
          x={(col + c) * CELL}
          y={(row + r) * CELL}
          width={CELL}
          height={CELL}
          fill={fill}
          stroke={LINE}
          strokeWidth="0.5"
        />
      );
    }
  }
  return <>{cells}</>;
}

function HomeBase({ color, col, row }) {
  const x = col * CELL;
  const y = row * CELL;
  const size = 6 * CELL;
  const spots = [
    [75, 75],
    [165, 75],
    [75, 165],
    [165, 165],
  ];

  return (
    <g>
      <rect x={x} y={y} width={size} height={size} fill={COLORS[color]} />
      <rect x={x + 30} y={y + 30} width="180" height="180" rx="8" fill={WHITE} />
      {spots.map(([dx, dy]) => (
        <circle key={`${dx}-${dy}`} cx={x + dx} cy={y + dy} r="18" fill={COLORS[color]} />
      ))}
    </g>
  );
}

export default function LudoBoard({ size = "100%", maxWidth = 640, children }) {
  return (
    <svg
      viewBox={`0 0 ${BOARD} ${BOARD}`}
      width={size}
      style={{ maxWidth, display: "block" }}
      role="img"
      aria-label="Ludo board"
    >
      <rect x="0" y="0" width={BOARD} height={BOARD} fill={WHITE} stroke={LINE} strokeWidth="1" />

      {BASES.map((b) => (
        <HomeBase key={b.color} {...b} />
      ))}

      {ARMS.map((a, i) => (
        <Cells key={i} {...a} fill={WHITE} />
      ))}

      {HOME_COLUMNS.map((h) => (
        <Cells key={h.color} {...h} fill={COLORS[h.color]} />
      ))}

      {STARTS.map((s) => (
        <Cells key={s.color} col={s.col} row={s.row} w={1} h={1} fill={COLORS[s.color]} />
      ))}

      {TRIANGLES.map((t) => (
        <polygon key={t.color} points={t.points} fill={COLORS[t.color]} />
      ))}

      {ARMS.map((a, i) => (
        <rect
          key={i}
          x={a.col * CELL}
          y={a.row * CELL}
          width={a.w * CELL}
          height={a.h * CELL}
          fill="none"
          stroke={LINE}
          strokeWidth="1"
        />
      ))}

      {SAFE.map((s) => (
        <circle
          key={`${s.col}-${s.row}`}
          cx={s.col * CELL + CELL / 2}
          cy={s.row * CELL + CELL / 2}
          r="9"
          fill="none"
          stroke={LINE}
          strokeWidth="1.5"
        />
      ))}

      {children}
    </svg>
  );
}
