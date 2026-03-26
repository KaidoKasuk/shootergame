import { CASINO_OUTCOMES } from '../constants';

export default function CasinoWheel({ rotation }) {
  const n = CASINO_OUTCOMES.length;
  const anglePerSlice = 360 / n;
  const r = 160;
  const cx = 170, cy = 170;

  return (
    <svg
      width="340"
      height="340"
      viewBox="0 0 340 340"
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: rotation > 0 ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
      }}
    >
      <defs>
        <filter id="wheelShadow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#ffaa00" strokeWidth="3" filter="url(#wheelShadow)" />
      {CASINO_OUTCOMES.map((outcome, i) => {
        const startAngle = (anglePerSlice * i - 90) * (Math.PI / 180);
        const endAngle = (anglePerSlice * (i + 1) - 90) * (Math.PI / 180);
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const midAngle = (anglePerSlice * i + anglePerSlice / 2 - 90) * (Math.PI / 180);
        const tx = cx + (r * 0.65) * Math.cos(midAngle);
        const ty = cy + (r * 0.65) * Math.sin(midAngle);
        const textRot = anglePerSlice * i + anglePerSlice / 2;

        return (
          <g key={i}>
            <path
              d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
              fill={outcome.color}
              stroke="#000"
              strokeWidth="1.5"
            />
            <text
              x={tx}
              y={ty}
              fill="#fff"
              fontSize="8"
              fontFamily="'Share Tech Mono', 'Courier New', monospace"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${textRot}, ${tx}, ${ty})`}
              style={{ textShadow: '1px 1px 2px #000' }}
            >
              {outcome.label}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="22" fill="#1a1a1a" stroke="#ffaa00" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="8" fill="#ffaa00" />
    </svg>
  );
}