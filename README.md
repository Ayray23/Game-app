# Arcade Arena

A React + Vite multiplayer game hub with local and online Tic Tac Toe, real-time Socket.IO synchronization, live room chat, and browser-generated sound effects.

## Games

- Tic Tac Toe — local 2-player mode
- Tic Tac Toe — online rooms for two players
- Pokemon Memory — solo mode

## Online multiplayer

The client uses `VITE_SOCKET_URL` for the Socket.IO server. If it is not set, it falls back to the deployed game server URL.

### Client

```bash
npm install
npm run dev
```

For Vercel, set:

```text
VITE_SOCKET_URL=https://game-server-1-sxiw.onrender.com
```

### Server

```bash
npm install
npm start
```

The server exposes `/health` and handles rooms, turn validation, game state, rematches, disconnects, and live chat.

## Sound

Game sounds use the browser Web Audio API, so no external audio files are required. Sound starts after normal user interaction to comply with browser autoplay restrictions.
