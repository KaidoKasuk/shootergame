import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, 'data', 'stats.json');

const app = express();
app.use(cors());
app.use(express.json());

const emptyStats = { gamesPlayed: 0, wins: 0, losses: 0, shotsFired: 0, selfShots: 0 };

function readStats() {
  try { return JSON.parse(readFileSync(DATA_FILE, 'utf8')); }
  catch { return {}; }
}

function writeStats(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /api/stats — all players (for leaderboard)
app.get('/api/stats', (req, res) => {
  res.json(readStats());
});

// GET /api/stats/:player — one player's stats
app.get('/api/stats/:player', (req, res) => {
  const all = readStats();
  res.json(all[req.params.player] || null);
});

// POST /api/stats/:player/shot — record a shot { atSelf: boolean }
app.post('/api/stats/:player/shot', (req, res) => {
  const { atSelf } = req.body;
  const all = readStats();
  const s = all[req.params.player] || { ...emptyStats };
  s.shotsFired += 1;
  if (atSelf) s.selfShots += 1;
  all[req.params.player] = s;
  writeStats(all);
  res.json(s);
});

// POST /api/stats/:player/game-end — record game result { won: boolean }
app.post('/api/stats/:player/game-end', (req, res) => {
  const { won } = req.body;
  const all = readStats();
  const s = all[req.params.player] || { ...emptyStats };
  s.gamesPlayed += 1;
  if (won) s.wins += 1;
  else s.losses += 1;
  all[req.params.player] = s;
  writeStats(all);
  res.json(s);
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));
