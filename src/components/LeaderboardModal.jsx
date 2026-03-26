import { useState, useEffect } from 'react';
import { useStats } from '../context/StatsContext';
import Modal from './Modal';

export default function LeaderboardModal({ onClose }) {
  const { getLeaderboard, currentPlayer } = useStats();
  const [board, setBoard] = useState([]);

  useEffect(() => {
    getLeaderboard().then(setBoard);
  }, [getLeaderboard]);

  return (
    <Modal title="LEADERBOARD" onClose={onClose}>
      {board.length === 0 ? (
        <p className="modal-text">No games played yet. Be the first!</p>
      ) : (
        <table className="lb-table">
          <thead>
            <tr>
              <th className="lb-th">#</th>
              <th className="lb-th lb-th-name">Player</th>
              <th className="lb-th">W</th>
              <th className="lb-th">L</th>
              <th className="lb-th">Win%</th>
            </tr>
          </thead>
          <tbody>
            {board.map((p, i) => {
              const isYou = p.name === currentPlayer;
              const winRate = p.gamesPlayed > 0
                ? Math.round((p.wins / p.gamesPlayed) * 100)
                : 0;
              return (
                <tr key={p.name} className={isYou ? 'lb-row lb-you' : 'lb-row'}>
                  <td className="lb-td lb-rank">{i + 1}</td>
                  <td className="lb-td lb-name">
                    {isYou ? `You (${p.name})` : p.name}
                  </td>
                  <td className="lb-td lb-wins">{p.wins}</td>
                  <td className="lb-td lb-losses">{p.losses}</td>
                  <td className="lb-td lb-rate">{winRate}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </Modal>
  );
}
