import { useState } from "react";
import { TOTAL_ROUNDS, CHAMBER_SIZE } from "../../constants";
import { useStats } from "../../context/StatsContext";
import Navbar from "./Navbar";
import PlayerCard from "./Playercard";
import ChamberSVG from "../ChamberSVG";
import ActionConsole from "./ActionConsole";
import TablePanel from "./Tablepanel";
import CasinoModal from "../CasinoModal";
import LeaderboardModal from "../LeaderboardModal";
import Modal from "../Modal";
import "./GameScreen.css";

export default function GameScreen({
  playerName,
  playerPic,
  playerHP,
  playerWins,
  enemyName,
  enemyPic,
  enemyHP,
  enemyWins,
  round,
  turn,
  isPlayerTurn,
  bullets,
  spinning,
  casinoUsed,
  canAct,
  log,
  // Modal states
  showHowToPlay,
  setShowHowToPlay,
  showSettings,
  setShowSettings,
  showStats,
  setShowStats,
  showCasino,
  wheelRotation,
  wheelSpinning,
  wheelResult,
  showConfetti,
  // Actions
  onShootSelf,
  onShootEnemy,
  onSpinChamber,
  onOpenCasino,
  onSpinWheel,
  onCloseCasino,
  onNewGame,
  onExit,
}) {
  const { stats } = useStats();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const liveCount = bullets.filter(Boolean).length;
  const blankCount = CHAMBER_SIZE - liveCount;

  return (
    <div className="game-screen">
      {/* Navbar */}
      <Navbar
        onNewGame={onNewGame}
        onHowToPlay={() => setShowHowToPlay(true)}
        onSettings={() => setShowSettings(true)}
        onStats={() => setShowStats(true)}
        onLeaderboard={() => setShowLeaderboard(true)}
        onExit={onExit}
      />

      {/* Game Area */}
      <div className="game-area">
        <div className="game-scanline" />

        <PlayerCard
          name={playerName}
          picIndex={playerPic}
          hp={playerHP}
          wins={playerWins}
        />

        <div className="center-stage">
          <div className="round-info">
            Round {round}/{TOTAL_ROUNDS} &middot; Turn {turn}
          </div>
          <ChamberSVG bullets={bullets} spinning={spinning} />
          <div className="chamber-info">
            {liveCount} LIVE &middot; {blankCount} BLANK
          </div>
        </div>

        <PlayerCard
          name={enemyName}
          picIndex={enemyPic}
          hp={enemyHP}
          wins={enemyWins}
        />
      </div>

      {/* Bottom Panel */}
      <div className="bottom-panel">
        <ActionConsole
          isPlayerTurn={isPlayerTurn}
          enemyName={enemyName}
          playerName={playerName}
          log={log}
          canAct={canAct}
          onShootSelf={onShootSelf}
          onShootEnemy={onShootEnemy}
          onSpinChamber={onSpinChamber}
        />
        <TablePanel
          canAct={canAct}
          casinoUsed={casinoUsed}
          onOpenCasino={onOpenCasino}
        />
      </div>

      {/* ── Modals ── */}

      {showHowToPlay && (
        <Modal title="HOW TO PLAY" onClose={() => setShowHowToPlay(false)}>
          {[
            "Six Shooter is a game of Russian Roulette. A revolver with 6 chambers is loaded with 1-3 live rounds each round.",
            "SHOOT SELF: If the chamber is blank, you get another turn. If live, you take 1 damage and the turn passes.",
            "SHOOT ENEMY: If live, the enemy takes 1 damage. Turn always passes to the enemy.",
            "SPIN CHAMBER: Randomizes which chamber is next, but costs your turn.",
            "CASINO: Once per round, spin the carnival wheel for a random bonus or penalty. Both good and bad outcomes trigger confetti!",
            "Win 3 out of 5 rounds to win the game. Reduce the opponent to 0 HP to win a round.",
          ].map((t, i) => (
            <p key={i} className="modal-text">
              {t}
            </p>
          ))}
        </Modal>
      )}

      {showSettings && (
        <Modal title="SETTINGS" onClose={() => setShowSettings(false)}>
          <p className="modal-stat">Sound: Coming soon</p>
          <p className="modal-stat">Difficulty: Standard</p>
          <p className="modal-stat">Theme: Dark (default)</p>
        </Modal>
      )}

      {showStats && (
        <Modal title="STATISTICS" onClose={() => setShowStats(false)}>
          <p className="modal-stat">Games Played: {stats.gamesPlayed}</p>
          <p className="modal-stat">Wins: {stats.wins}</p>
          <p className="modal-stat">Losses: {stats.losses}</p>
          <p className="modal-stat">
            Win Rate:{" "}
            {stats.gamesPlayed > 0
              ? Math.round((stats.wins / stats.gamesPlayed) * 100)
              : 0}
            %
          </p>
          <p className="modal-stat">Shots Fired: {stats.shotsFired}</p>
          <p className="modal-stat">Self Shots: {stats.selfShots}</p>
        </Modal>
      )}

      {showLeaderboard && (
        <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
      )}

      {showCasino && (
        <CasinoModal
          wheelRotation={wheelRotation}
          wheelSpinning={wheelSpinning}
          wheelResult={wheelResult}
          showConfetti={showConfetti}
          onSpin={onSpinWheel}
          onClose={onCloseCasino}
        />
      )}
    </div>
  );
}
