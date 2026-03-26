import { useState, useReducer, useRef } from "react";
import {
  MAX_HP,
  ROUNDS_TO_WIN,
  CHAMBER_SIZE,
  CASINO_OUTCOMES,
  ENEMY_NAMES,
  PROFILE_PICS,
  rand,
} from "./constants";
import { useStats } from "./context/StatsContext";
import LoginScreen from "./components/LoginScreen";
import GameScreen from "./components/DisplayParts/GameScreen";
import GameOverScreen from "./components/GameOverScreen";

function generateBullets() {
  const b = Array(CHAMBER_SIZE).fill(false);
  const liveCount = rand(1, 3);
  const positions = [];
  while (positions.length < liveCount) {
    const p = rand(0, CHAMBER_SIZE - 1);
    if (!positions.includes(p)) positions.push(p);
  }
  positions.forEach((p) => (b[p] = true));
  return b;
}

// ── Game state reducer ──────────────────────────────────────────────────────
const initialGameState = {
  enemyName: "",
  enemyPic: 0,
  playerHP: MAX_HP,
  enemyHP: MAX_HP,
  round: 1,
  turn: 1,
  playerWins: 0,
  enemyWins: 0,
  isPlayerTurn: true,
  bullets: [],
  currentChamber: 0,
  spinning: false,
  casinoUsed: false,
  gameWon: null,
  actionLocked: false,
  log: [],
};

function gameReducer(state, action) {
  switch (action.type) {
    case "INIT":
      return {
        ...initialGameState,
        enemyName: action.enemyName,
        enemyPic: action.enemyPic,
        bullets: action.bullets,
      };
    case "ADD_LOG":
      return {
        ...state,
        log: [
          ...state.log,
          {
            text: action.text,
            type: action.logType || "default",
            id: Date.now() + Math.random(),
          },
        ],
      };
    case "SET_HP": {
      const key = action.target === "player" ? "playerHP" : "enemyHP";
      return { ...state, [key]: action.value };
    }
    case "ADVANCE_CHAMBER":
      return {
        ...state,
        currentChamber: (state.currentChamber + 1) % CHAMBER_SIZE,
      };
    case "SET_CHAMBER":
      return { ...state, currentChamber: action.index };
    case "SET_SPINNING":
      return { ...state, spinning: action.value };
    case "SET_PLAYER_TURN":
      return { ...state, isPlayerTurn: action.value };
    case "INCREMENT_TURN":
      return { ...state, turn: state.turn + 1 };
    case "SET_ACTION_LOCKED":
      return { ...state, actionLocked: action.value };
    case "USE_CASINO":
      return { ...state, casinoUsed: true };
    case "ADD_WIN":
      return { ...state, playerWins: state.playerWins + 1 };
    case "ADD_LOSS":
      return { ...state, enemyWins: state.enemyWins + 1 };
    case "NEXT_ROUND":
      return {
        ...state,
        round: state.round + 1,
        turn: 1,
        playerHP: MAX_HP,
        enemyHP: MAX_HP,
        bullets: action.bullets,
        currentChamber: 0,
        casinoUsed: false,
        isPlayerTurn: true,
        actionLocked: false,
      };
    case "GAME_OVER":
      return { ...state, gameWon: action.won };
    default:
      return state;
  }
}

// ────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login");
  const [playerName, setPlayerName] = useState("");
  const [playerPic, setPlayerPic] = useState(0);
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  // Modal state (UI-only, stays as useState)
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showCasino, setShowCasino] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Stats from context
  const { recordShot, recordGameEnd, setCurrentPlayer } = useStats();

  const {
    enemyName,
    enemyPic,
    playerHP,
    enemyHP,
    round,
    turn,
    playerWins,
    enemyWins,
    isPlayerTurn,
    bullets,
    currentChamber,
    spinning,
    casinoUsed,
    gameWon,
    actionLocked,
    log,
  } = gameState;

  // Refs for reading state safely inside async setTimeout callbacks
  const playerHPRef = useRef(playerHP);
  const enemyHPRef = useRef(enemyHP);
  const playerWinsRef = useRef(playerWins);
  const enemyWinsRef = useRef(enemyWins);
  const roundRef = useRef(round);
  const bulletsRef = useRef(bullets);
  const currentChamberRef = useRef(currentChamber);
  const enemyNameRef = useRef(enemyName);
  playerHPRef.current = playerHP;
  enemyHPRef.current = enemyHP;
  playerWinsRef.current = playerWins;
  enemyWinsRef.current = enemyWins;
  roundRef.current = round;
  bulletsRef.current = bullets;
  currentChamberRef.current = currentChamber;
  enemyNameRef.current = enemyName;

  // Function refs so setTimeouts always call the latest version
  const endRoundRef = useRef(null);
  const enemyTurnRef = useRef(null);

  // ── START GAME  (HTTP fetch for enemy name) ──────────────────────────────
  async function startGame() {
    if (!playerName.trim()) return;

    let eName = ENEMY_NAMES[rand(0, ENEMY_NAMES.length - 1)];
    const ePic = rand(0, PROFILE_PICS.length - 1);

    try {
      const res = await fetch("https://randomuser.me/api/");
      const data = await res.json();
      const user = data.results[0];
      eName = `${user.name.first} ${user.name.last[0]}.`;
    } catch {
      // network unavailable — use local fallback name
    }

    const newBullets = generateBullets();
    setCurrentPlayer(playerName.trim());
    dispatch({
      type: "INIT",
      enemyName: eName,
      enemyPic: ePic,
      bullets: newBullets,
    });
    setScreen("game");

    setTimeout(() => {
      const liveCount = newBullets.filter(Boolean).length;
      dispatch({
        type: "ADD_LOG",
        text: "[SYSTEM] Game started. Round 1.",
        logType: "system",
      });
      dispatch({
        type: "ADD_LOG",
        text: `[SYSTEM] ${liveCount} live round${liveCount > 1 ? "s" : ""} loaded.`,
        logType: "system",
      });
      dispatch({
        type: "ADD_LOG",
        text: `[SYSTEM] Your turn, ${playerName.trim()}.`,
        logType: "info",
      });
    }, 100);
  }

  // ── FIRE SHOT ────────────────────────────────────────────────────────────
  function fireShot(atSelf) {
    if (!isPlayerTurn || spinning || actionLocked) return;
    const isLive = bulletsRef.current[currentChamberRef.current];
    dispatch({ type: "ADVANCE_CHAMBER" });
    recordShot(atSelf);

    if (atSelf) {
      if (isLive) {
        dispatch({
          type: "ADD_LOG",
          text: "> You shoot yourself... BANG! -1 HP",
          logType: "damage",
        });
        const newHP = Math.max(0, playerHPRef.current - 1);
        dispatch({ type: "SET_HP", target: "player", value: newHP });
        if (newHP <= 0) {
          setTimeout(() => endRoundRef.current(false), 500);
          return;
        }
        dispatch({ type: "INCREMENT_TURN" });
        dispatch({ type: "SET_PLAYER_TURN", value: false });
        dispatch({ type: "SET_ACTION_LOCKED", value: true });
        setTimeout(() => {
          dispatch({ type: "SET_ACTION_LOCKED", value: false });
          enemyTurnRef.current();
        }, 1500);
      } else {
        dispatch({
          type: "ADD_LOG",
          text: "> You shoot yourself... *click* Empty. Go again.",
          logType: "info",
        });
      }
    } else {
      if (isLive) {
        dispatch({
          type: "ADD_LOG",
          text: `> You shoot ${enemyNameRef.current}... BANG! -1 HP`,
          logType: "damage",
        });
        const newHP = Math.max(0, enemyHPRef.current - 1);
        dispatch({ type: "SET_HP", target: "enemy", value: newHP });
        if (newHP <= 0) {
          setTimeout(() => endRoundRef.current(true), 500);
          return;
        }
      } else {
        dispatch({
          type: "ADD_LOG",
          text: `> You shoot ${enemyNameRef.current}... *click* Empty.`,
          logType: "info",
        });
      }
      dispatch({ type: "INCREMENT_TURN" });
      dispatch({ type: "SET_PLAYER_TURN", value: false });
      dispatch({ type: "SET_ACTION_LOCKED", value: true });
      setTimeout(() => {
        dispatch({ type: "SET_ACTION_LOCKED", value: false });
        enemyTurnRef.current();
      }, 1500);
    }
  }

  // ── SPIN CHAMBER ─────────────────────────────────────────────────────────
  function spinChamberAction() {
    if (!isPlayerTurn || spinning || actionLocked) return;
    dispatch({ type: "SET_SPINNING", value: true });
    dispatch({
      type: "ADD_LOG",
      text: "> You spin the chamber...",
      logType: "info",
    });
    setTimeout(() => {
      dispatch({ type: "SET_CHAMBER", index: rand(0, CHAMBER_SIZE - 1) });
      dispatch({ type: "SET_SPINNING", value: false });
      dispatch({ type: "ADD_LOG", text: "> Chamber spun.", logType: "system" });
      dispatch({ type: "INCREMENT_TURN" });
      dispatch({ type: "SET_PLAYER_TURN", value: false });
      dispatch({ type: "SET_ACTION_LOCKED", value: true });
      setTimeout(() => {
        dispatch({ type: "SET_ACTION_LOCKED", value: false });
        enemyTurnRef.current();
      }, 1000);
    }, 700);
  }

  // ── ENEMY TURN ───────────────────────────────────────────────────────────
  function enemyTurn() {
    dispatch({
      type: "ADD_LOG",
      text: `[${enemyNameRef.current.toUpperCase()}] thinking...`,
      logType: "system",
    });

    setTimeout(() => {
      const choice = rand(0, 10);
      const isLive = bulletsRef.current[currentChamberRef.current];
      dispatch({ type: "ADVANCE_CHAMBER" });

      if (choice <= 2) {
        if (isLive) {
          dispatch({
            type: "ADD_LOG",
            text: `[${enemyNameRef.current.toUpperCase()}] shoots self... BANG! -1 HP`,
            logType: "damage",
          });
          const newHP = Math.max(0, enemyHPRef.current - 1);
          dispatch({ type: "SET_HP", target: "enemy", value: newHP });
          if (newHP <= 0) {
            setTimeout(() => endRoundRef.current(true), 500);
            return;
          }
          dispatch({ type: "INCREMENT_TURN" });
          dispatch({ type: "SET_PLAYER_TURN", value: true });
          dispatch({
            type: "ADD_LOG",
            text: "[SYSTEM] Your turn.",
            logType: "info",
          });
        } else {
          dispatch({
            type: "ADD_LOG",
            text: `[${enemyNameRef.current.toUpperCase()}] shoots self... *click* Empty. Goes again.`,
            logType: "info",
          });
          setTimeout(() => enemyTurnRef.current(), 1200);
          return;
        }
      } else if (choice <= 8) {
        if (isLive) {
          dispatch({
            type: "ADD_LOG",
            text: `[${enemyNameRef.current.toUpperCase()}] shoots you... BANG! -1 HP`,
            logType: "damage",
          });
          const newHP = Math.max(0, playerHPRef.current - 1);
          dispatch({ type: "SET_HP", target: "player", value: newHP });
          if (newHP <= 0) {
            setTimeout(() => endRoundRef.current(false), 500);
            return;
          }
        } else {
          dispatch({
            type: "ADD_LOG",
            text: `[${enemyNameRef.current.toUpperCase()}] shoots you... *click* Empty.`,
            logType: "info",
          });
        }
        dispatch({ type: "INCREMENT_TURN" });
        dispatch({ type: "SET_PLAYER_TURN", value: true });
        dispatch({
          type: "ADD_LOG",
          text: "[SYSTEM] Your turn.",
          logType: "info",
        });
      } else {
        dispatch({
          type: "ADD_LOG",
          text: `[${enemyNameRef.current.toUpperCase()}] spins the chamber.`,
          logType: "info",
        });
        dispatch({ type: "SET_SPINNING", value: true });
        setTimeout(() => {
          dispatch({ type: "SET_CHAMBER", index: rand(0, CHAMBER_SIZE - 1) });
          dispatch({ type: "SET_SPINNING", value: false });
          dispatch({ type: "INCREMENT_TURN" });
          dispatch({ type: "SET_PLAYER_TURN", value: true });
          dispatch({
            type: "ADD_LOG",
            text: "[SYSTEM] Your turn.",
            logType: "info",
          });
        }, 700);
      }
    }, 1200);
  }
  enemyTurnRef.current = enemyTurn;

  // ── END ROUND ────────────────────────────────────────────────────────────
  function endRound(playerWon) {
    if (playerWon) {
      const newWins = playerWinsRef.current + 1;
      dispatch({ type: "ADD_WIN" });
      dispatch({
        type: "ADD_LOG",
        text: `[SYSTEM] === ROUND ${roundRef.current} WON ===`,
        logType: "heal",
      });
      if (newWins >= ROUNDS_TO_WIN) {
        recordGameEnd(true);
        dispatch({ type: "GAME_OVER", won: true });
        setScreen("gameover");
        return;
      }
    } else {
      const newLosses = enemyWinsRef.current + 1;
      dispatch({ type: "ADD_LOSS" });
      dispatch({
        type: "ADD_LOG",
        text: `[SYSTEM] === ROUND ${roundRef.current} LOST ===`,
        logType: "damage",
      });
      if (newLosses >= ROUNDS_TO_WIN) {
        recordGameEnd(false);
        dispatch({ type: "GAME_OVER", won: false });
        setScreen("gameover");
        return;
      }
    }

    const nextRound = roundRef.current + 1;
    const newBullets = generateBullets();
    dispatch({ type: "NEXT_ROUND", bullets: newBullets });

    setTimeout(() => {
      const liveCount = newBullets.filter(Boolean).length;
      dispatch({
        type: "ADD_LOG",
        text: `[SYSTEM] Round ${nextRound} begins. ${liveCount} live round${liveCount > 1 ? "s" : ""} loaded.`,
        logType: "system",
      });
      dispatch({
        type: "ADD_LOG",
        text: "[SYSTEM] Your turn.",
        logType: "info",
      });
    }, 300);
  }
  endRoundRef.current = endRound;

  // ── CASINO ───────────────────────────────────────────────────────────────
  function openCasino() {
    if (casinoUsed || !isPlayerTurn || actionLocked) return;
    setShowCasino(true);
    setWheelResult(null);
    setWheelRotation(0);
  }

  function spinWheel() {
    if (wheelSpinning) return;
    setWheelSpinning(true);
    setWheelResult(null);

    const winIndex = rand(0, CASINO_OUTCOMES.length - 1);
    const anglePerSlice = 360 / CASINO_OUTCOMES.length;
    const targetAngle =
      360 * 5 + (360 - winIndex * anglePerSlice - anglePerSlice / 2);
    setWheelRotation(targetAngle);

    setTimeout(() => {
      const outcome = CASINO_OUTCOMES[winIndex];
      setWheelResult(outcome);
      setWheelSpinning(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      applyCasinoOutcome(outcome);
    }, 4200);
  }

  function applyCasinoOutcome(outcome) {
    dispatch({ type: "USE_CASINO" });
    switch (outcome.action) {
      case "instakill":
        dispatch({
          type: "ADD_LOG",
          text: `[CASINO] INSTA KILL! ${enemyNameRef.current} eliminated!`,
          logType: "heal",
        });
        dispatch({ type: "SET_HP", target: "enemy", value: 0 });
        setTimeout(() => endRoundRef.current(true), 1000);
        break;
      case "heal3":
        dispatch({
          type: "ADD_LOG",
          text: "[CASINO] +3 HP restored!",
          logType: "heal",
        });
        dispatch({
          type: "SET_HP",
          target: "player",
          value: Math.min(MAX_HP, playerHPRef.current + 3),
        });
        break;
      case "heal1":
        dispatch({
          type: "ADD_LOG",
          text: "[CASINO] +1 HP restored!",
          logType: "heal",
        });
        dispatch({
          type: "SET_HP",
          target: "player",
          value: Math.min(MAX_HP, playerHPRef.current + 1),
        });
        break;
      case "skipSelf":
        dispatch({
          type: "ADD_LOG",
          text: "[CASINO] Skip your turn! Enemy goes next.",
          logType: "info",
        });
        dispatch({ type: "SET_PLAYER_TURN", value: false });
        dispatch({ type: "SET_ACTION_LOCKED", value: true });
        setTimeout(() => {
          dispatch({ type: "SET_ACTION_LOCKED", value: false });
          dispatch({ type: "INCREMENT_TURN" });
          enemyTurnRef.current();
        }, 800);
        break;
      case "skipEnemy":
        dispatch({
          type: "ADD_LOG",
          text: "[CASINO] Skip enemy turn! You go again!",
          logType: "heal",
        });
        break;
      case "lose3": {
        dispatch({
          type: "ADD_LOG",
          text: "[CASINO] -3 HP! Ouch!",
          logType: "damage",
        });
        const nh = Math.max(0, playerHPRef.current - 3);
        dispatch({ type: "SET_HP", target: "player", value: nh });
        if (nh <= 0) setTimeout(() => endRoundRef.current(false), 500);
        break;
      }
      case "lose2": {
        dispatch({
          type: "ADD_LOG",
          text: "[CASINO] -2 HP!",
          logType: "damage",
        });
        const nh = Math.max(0, playerHPRef.current - 2);
        dispatch({ type: "SET_HP", target: "player", value: nh });
        if (nh <= 0) setTimeout(() => endRoundRef.current(false), 500);
        break;
      }
      case "lose1": {
        dispatch({
          type: "ADD_LOG",
          text: "[CASINO] -1 HP!",
          logType: "damage",
        });
        const nh = Math.max(0, playerHPRef.current - 1);
        dispatch({ type: "SET_HP", target: "player", value: nh });
        if (nh <= 0) setTimeout(() => endRoundRef.current(false), 500);
        break;
      }
      case "nothing":
        dispatch({
          type: "ADD_LOG",
          text: "[CASINO] Nothing happens. Pick up the revolver.",
          logType: "system",
        });
        break;
    }
  }

  function closeCasino() {
    setShowCasino(false);
  }

  function goToLogin() {
    setScreen("login");
    setPlayerName("");
  }

  const canAct = isPlayerTurn && !spinning && !actionLocked;

  // ── Render ───────────────────────────────────────────────────────────────
  if (screen === "login") {
    return (
      <LoginScreen
        playerName={playerName}
        setPlayerName={setPlayerName}
        playerPic={playerPic}
        setPlayerPic={setPlayerPic}
        onStart={startGame}
      />
    );
  }

  if (screen === "gameover") {
    return (
      <GameOverScreen
        gameWon={gameWon}
        enemyName={enemyName}
        onNewGame={goToLogin}
      />
    );
  }

  return (
    <GameScreen
      playerName={playerName}
      playerPic={playerPic}
      playerHP={playerHP}
      playerWins={playerWins}
      enemyName={enemyName}
      enemyPic={enemyPic}
      enemyHP={enemyHP}
      enemyWins={enemyWins}
      round={round}
      turn={turn}
      isPlayerTurn={isPlayerTurn}
      bullets={bullets}
      spinning={spinning}
      casinoUsed={casinoUsed}
      canAct={canAct}
      log={log}
      showHowToPlay={showHowToPlay}
      setShowHowToPlay={setShowHowToPlay}
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      showStats={showStats}
      setShowStats={setShowStats}
      showCasino={showCasino}
      wheelRotation={wheelRotation}
      wheelSpinning={wheelSpinning}
      wheelResult={wheelResult}
      showConfetti={showConfetti}
      onShootSelf={() => fireShot(true)}
      onShootEnemy={() => fireShot(false)}
      onSpinChamber={spinChamberAction}
      onOpenCasino={openCasino}
      onSpinWheel={spinWheel}
      onCloseCasino={closeCasino}
      onNewGame={goToLogin}
      onExit={goToLogin}
    />
  );
}
