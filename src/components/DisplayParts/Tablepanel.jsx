import "./TablePanel.css";

export default function TablePanel({ canAct, casinoUsed, onOpenCasino }) {
  const btnActive = canAct && !casinoUsed;

  return (
    <div className="table-panel">
      <div className="table-panel-title">Table</div>
      <div className="table-content">
        {/* happy wheel :D
         */}
        <div className="casino-section">
          <div className="casino-label">CASINO</div>
          <button
            className={`casino-btn ${btnActive ? "active" : "disabled"}`}
            onClick={onOpenCasino}
            disabled={!btnActive}
          >
            {casinoUsed ? "USED" : "SPIN"}
          </button>
          {casinoUsed && <div className="casino-used-text">once per round</div>}
        </div>
      </div>
    </div>
  );
}
