export const MAX_HP = 5;
export const CHAMBER_SIZE = 6;
export const TOTAL_ROUNDS = 5;
export const ROUNDS_TO_WIN = 3;

export function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const ENEMY_NAMES = [
  'V. Markov', 'I. Volkov', 'D. Sokolov', 'A. Petrov',
  'N. Kozlov', 'S. Orlov', 'B. Lebedev', 'R. Morozov',
];

export const PROFILE_PICS = ['🎭', '💀', '🤠', '👁️', '🎪', '🦅', '🐺', '🃏'];

export const CASINO_OUTCOMES = [
  { action: 'instakill', label: 'INSTA\nKILL',  type: 'good',    color: '#cc0000' },
  { action: 'heal3',     label: '+3 HP',         type: 'good',    color: '#007700' },
  { action: 'heal1',     label: '+1 HP',         type: 'good',    color: '#009900' },
  { action: 'skipEnemy', label: 'SKIP\nENEMY',   type: 'good',    color: '#005588' },
  { action: 'nothing',   label: 'NOTHING',       type: 'neutral', color: '#444444' },
  { action: 'lose1',     label: '-1 HP',         type: 'bad',     color: '#882200' },
  { action: 'lose2',     label: '-2 HP',         type: 'bad',     color: '#aa2200' },
  { action: 'lose3',     label: '-3 HP',         type: 'bad',     color: '#cc3300' },
  { action: 'skipSelf',  label: 'SKIP\nYOU',     type: 'bad',     color: '#663300' },
];
