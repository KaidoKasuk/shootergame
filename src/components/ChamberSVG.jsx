import { CHAMBER_SIZE } from '../constants';

export default function ChamberSVG({ bullets, spinning }) {
  const slotAngle = 360 / CHAMBER_SIZE;
  const cx = 80, cy = 80, r = 50;

  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      className={spinning ? 'chamber-spinning' : ''}
      style={{
        filter: 'drop-shadow(0 0 15px rgba(255,34,34,0.15))',
        animation: spinning ? 'chamberSpin 0.6s ease-out' : 'none',
      }}
    >
      <defs>
        <radialGradient id="chamberGrad">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#111" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r="72" fill="url(#chamberGrad)" stroke="#444" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="68" fill="none" stroke="#222" strokeWidth="0.5" />
      {Array.from({ length: CHAMBER_SIZE }).map((_, i) => {
        const angle = (slotAngle * i - 90) * (Math.PI / 180);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const hasBullet = bullets[i];
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="14" fill="#0a0a0a" stroke="#444" strokeWidth="1.5" />
            {hasBullet ? (
              <circle cx={x} cy={y} r="9" fill="#cc3300" stroke="#ff4400" strokeWidth="1">
                <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
              </circle>
            ) : (
              <circle cx={x} cy={y} r="9" fill="#151515" stroke="#222" strokeWidth="0.5" />
            )}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="16" fill="#1a1a1a" stroke="#444" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="6" fill="#333" />
    </svg>
  );
}