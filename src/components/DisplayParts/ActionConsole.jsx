import { useRef, useEffect } from "react";
import "./ActionConsole.css";

export default function ActionConsole({
  isPlayerTurn,
  enemyName,
  playerName,
  log,
  canAct,
  onShootSelf,
  onShootEnemy,
  onSpinChamber,
}) {
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const username = playerName.trim().toLowerCase().replace(/\s/g, "");

  return (
    <div className="action-panel">
      <div className="console-tabs">
        <button className="console-tab active">Action Console</button>
        <button className="console-tab">Console Log</button>
      </div>

      <div className={`turn-indicator ${isPlayerTurn ? "player" : "enemy"}`}>
        {isPlayerTurn ? "\u2192 Your Turn" : `\u2192 ${enemyName}'s Turn`}
      </div>

      <div className="console-log" ref={logRef}>
        {log.map((entry) => (
          <div key={entry.id} className={`log-line ${entry.type}`}>
            {entry.text}
          </div>
        ))}
        <div className="console-prompt">
          game@{username}:~$<span className="console-cursor"></span>
        </div>
      </div>

      <div className="action-btns">
        <button className="action-btn" onClick={onShootSelf} disabled={!canAct}>
          Shoot Self
        </button>
        <button
          className="action-btn"
          onClick={onShootEnemy}
          disabled={!canAct}
        >
          Shoot Enemy
        </button>
        <button
          className="action-btn"
          onClick={onSpinChamber}
          disabled={!canAct}
        >
          Spin Chamber
        </button>
      </div>
    </div>
  );
}
