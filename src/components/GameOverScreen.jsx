import Confetti from './Confetti';
import './GameOverScreen.css';

export default function GameOverScreen({ gameWon, enemyName, onNewGame }) {
  return (
    <div className="gameover-screen">
      <Confetti active={gameWon} />
      <div className={`gameover-title ${gameWon ? 'win' : 'lose'}`}>
        {gameWon ? 'You Win' : 'You Died'}
      </div>
      <div className="gameover-sub">
        {gameWon
          ? `${enemyName} has been eliminated.`
          : `${enemyName} sends regards.`}
      </div>
      <button className="gameover-btn" onClick={onNewGame}>
        New Game
      </button>
    </div>
  );
}