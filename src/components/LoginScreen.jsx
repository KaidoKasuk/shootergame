import { useState } from 'react';
import { PROFILE_PICS } from '../constants';
import LeaderboardModal from './LeaderboardModal';
import './LoginScreen.css';

export default function LoginScreen({ playerName, setPlayerName, playerPic, setPlayerPic, onStart }) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div className="login-screen">
      <div className="login-scanline" />
      <div className="login-content">
        <div className="login-title">Six Shooter</div>
        <div className="login-subtitle">Russian Roulette</div>

        <div className="login-box">
          <label className="login-label">ENTER YOUR NAME</label>
          <input
            className="login-input"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="V. Markov"
            maxLength={20}
            onKeyDown={(e) => e.key === 'Enter' && onStart()}
          />

          <label className="login-label">CHOOSE AVATAR</label>
          <div className="pic-grid">
            {PROFILE_PICS.map((pic, i) => (
              <div
                key={i}
                className={`pic-option ${playerPic === i ? 'selected' : ''}`}
                onClick={() => setPlayerPic(i)}
              >
                {pic}
              </div>
            ))}
          </div>

          <button
            className="login-btn"
            onClick={onStart}
            disabled={!playerName.trim()}
          >
            Enter the Game
          </button>

          <button
            className="login-btn login-btn-secondary"
            onClick={() => setShowLeaderboard(true)}
          >
            Leaderboard
          </button>
        </div>
      </div>

      {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}
    </div>
  );
}