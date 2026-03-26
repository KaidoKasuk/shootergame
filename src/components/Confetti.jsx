import { rand } from '../constants';
import './Confetti.css';

export default function Confetti({ active }) {
  if (!active) return null;

  const pieces = Array.from({ length: 60 }).map((_, i) => ({
    left: `${rand(0, 100)}%`,
    delay: `${rand(0, 2000)}ms`,
    duration: `${rand(2000, 4000)}ms`,
    color: ['#ff2222', '#ffaa00', '#44ff44', '#ff44ff', '#44aaff', '#ffff44'][rand(0, 5)],
    size: rand(6, 14),
    isRound: rand(0, 1),
  }));

  return (
    <div className="confetti-container">
      {pieces.map((p, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: p.isRound ? '50%' : '2px',
            animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}