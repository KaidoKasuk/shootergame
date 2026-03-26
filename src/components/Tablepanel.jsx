import './TablePanel.css';

export default function TablePanel({ canAct, casinoUsed, onOpenCasino }) {
  const btnActive = canAct && !casinoUsed;

  return (
    <div className="table-panel">
      <div className="table-panel-title">Table</div>
      <div className="table-content">
        {/* Revolver */}
        <div className="table-label">REVOLVER</div>
        <svg width="180" height="70" viewBox="0 0 180 70">
          <rect x="20" y="25" width="110" height="18" rx="3" fill="#222" stroke="#444" strokeWidth="1" />
          <rect x="120" y="18" width="45" height="10" rx="2" fill="#2a2a2a" stroke="#444" strokeWidth="1" />
          <circle cx="32" cy="34" r="10" fill="none" stroke="#555" strokeWidth="1.5" />
          <rect x="42" y="43" width="28" height="22" rx="3" fill="#1a1a1a" stroke="#444" strokeWidth="1" />
          <rect x="46" y="48" width="20" height="14" rx="2" fill="#111" />
        </svg>

        {/* Casino */}
        <div className="casino-section">
          <div className="casino-label">CASINO</div>
          <button
            className={`casino-btn ${btnActive ? 'active' : 'disabled'}`}
            onClick={onOpenCasino}
            disabled={!btnActive}
          >
            {casinoUsed ? 'USED' : 'SPIN'}
          </button>
          {casinoUsed && <div className="casino-used-text">once per round</div>}
        </div>
      </div>
    </div>
  );
}