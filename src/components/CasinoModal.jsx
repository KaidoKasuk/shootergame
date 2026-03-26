import CasinoWheel from './CasinoWheel';
import Confetti from './Confetti';
import { CASINO_OUTCOMES } from '../constants';
import './CasinoModal.css';

const PCT = Math.round(100 / CASINO_OUTCOMES.length);

export default function CasinoModal({
  wheelRotation,
  wheelSpinning,
  wheelResult,
  showConfetti,
  onSpin,
  onClose,
}) {
  return (
    <div className="casino-overlay">
      <Confetti active={showConfetti} />
      <div className="casino-modal">
        <div className="casino-title">Casino</div>

        <div className="casino-content">
          {/* Wheel + controls */}
          <div className="casino-left">
            <div className="wheel-container">
              <div className="wheel-pointer" />
              <CasinoWheel rotation={wheelRotation} />
            </div>

            {!wheelResult && (
              <button
                className="casino-spin-btn"
                onClick={onSpin}
                disabled={wheelSpinning}
              >
                {wheelSpinning ? 'Spinning...' : 'Spin'}
              </button>
            )}

            {wheelResult && (
              <>
                <div className={`casino-result ${wheelResult.type}`}>
                  {wheelResult.label.replace('\n', ' ')}
                </div>
                <button className="casino-continue-btn" onClick={onClose}>
                  Continue
                </button>
              </>
            )}
          </div>

          {/* Cheatsheet */}
          <div className="casino-odds">
            <div className="odds-title">Chances</div>
            {CASINO_OUTCOMES.map((o, i) => (
              <div key={i} className="odds-row">
                <span className="odds-dot" style={{ background: o.color }} />
                <span className="odds-label">{o.label.replace('\n', ' ')}</span>
                <span className="odds-pct">{PCT}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}