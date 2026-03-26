import { createContext, useContext, useState, useCallback, useRef } from 'react';

const StatsContext = createContext(null);

const API = 'http://localhost:3001/api';
const emptyStats = { gamesPlayed: 0, wins: 0, losses: 0, shotsFired: 0, selfShots: 0 };

export function StatsProvider({ children }) {
  const [currentPlayer, setCurrentPlayerName] = useState('');
  const [stats, setStats] = useState({ ...emptyStats });

  const currentPlayerRef = useRef('');
  currentPlayerRef.current = currentPlayer;

  const setCurrentPlayer = useCallback(async (name) => {
    setCurrentPlayerName(name);
    try {
      const res = await fetch(`${API}/stats/${encodeURIComponent(name)}`);
      const data = await res.json();
      setStats(data ? { ...data } : { ...emptyStats });
    } catch {
      setStats({ ...emptyStats });
    }
  }, []);

  const recordShot = useCallback((atSelf) => {
    setStats((prev) => {
      const next = {
        ...prev,
        shotsFired: prev.shotsFired + 1,
        selfShots: atSelf ? prev.selfShots + 1 : prev.selfShots,
      };
      if (currentPlayerRef.current) {
        fetch(`${API}/stats/${encodeURIComponent(currentPlayerRef.current)}/shot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ atSelf }),
        }).catch(() => {});
      }
      return next;
    });
  }, []);

  const recordGameEnd = useCallback((won) => {
    setStats((prev) => {
      const next = {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        wins: won ? prev.wins + 1 : prev.wins,
        losses: won ? prev.losses : prev.losses + 1,
      };
      if (currentPlayerRef.current) {
        fetch(`${API}/stats/${encodeURIComponent(currentPlayerRef.current)}/game-end`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ won }),
        }).catch(() => {});
      }
      return next;
    });
  }, []);

  const getLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`${API}/stats`);
      const all = await res.json();
      return Object.entries(all)
        .map(([name, s]) => ({ name, ...s }))
        .sort((a, b) => b.wins - a.wins || a.losses - b.losses);
    } catch {
      return [];
    }
  }, []);

  return (
    <StatsContext.Provider value={{ stats, currentPlayer, setCurrentPlayer, recordShot, recordGameEnd, getLeaderboard }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  return useContext(StatsContext);
}
