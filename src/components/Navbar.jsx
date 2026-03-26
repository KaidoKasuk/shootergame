import './Navbar.css';

export default function Navbar({ onNewGame, onHowToPlay, onSettings, onStats, onLeaderboard, onExit }) {
  return (
    <div className="navbar">
      <div className="navbar-title">Six Shooter</div>
      <div className="navbar-btns">
        <button className="nav-btn" onClick={onNewGame}>New Game</button>
        <button className="nav-btn" onClick={onHowToPlay}>How to Play</button>
        <button className="nav-btn" onClick={onSettings}>Settings</button>
        <button className="nav-btn" onClick={onStats}>Statistics</button>
        <button className="nav-btn" onClick={onLeaderboard}>Leaderboard</button>
        <button className="nav-btn" onClick={onExit}>Exit</button>
      </div>
    </div>
  );
}