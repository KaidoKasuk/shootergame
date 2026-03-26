import { MAX_HP, PROFILE_PICS } from "../../constants";
import "./PlayerCard.css";

export default function PlayerCard({ name, picIndex, hp, wins }) {
  const pct = (hp / MAX_HP) * 100;
  const hpClass = hp > 3 ? "high" : hp > 1 ? "mid" : "low";

  return (
    <div className="player-card">
      <div className="player-avatar">{PROFILE_PICS[picIndex]}</div>
      <div className="player-name">{name}</div>
      <div className="player-hp-label">
        Health {hp} / {MAX_HP}
      </div>
      <div className="hp-bar-outer">
        <div
          className={`hp-bar-inner ${hpClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="player-wins">WINS: {wins}</div>
    </div>
  );
}
