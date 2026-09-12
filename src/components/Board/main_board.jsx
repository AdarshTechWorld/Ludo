import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./main_board.css";
import LudoBoard from "./LudoBoard";
import PlayerCard from "./PlayerCard";
import VictoryModal from "../Modals/VictoryModal";
import SettingsModal from "../Modals/SettingsModal";
import { TOTAL_STEPS_TO_HOME } from "../../utils/ludoConstants";
import {
  getMovableTokenIndices,
  checkCapture,
  isPlayerWinner,
  getNextPlayerId,
  getTokenGridPosition,
} from "../../utils/ludoLogic";
import { chooseBestBotMove } from "../../utils/ludoAI";
import { audioManager } from "../../utils/audioManager";
import { getSavedTheme } from "../../utils/themeManager";

const DEFAULT_PLAYERS = [
  { id: "RED", name: "Player 1", color: "RED", isBot: false, avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=RED" },
  { id: "GREEN", name: "Player 2", color: "GREEN", isBot: false, avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=GREEN" },
  { id: "YELLOW", name: "Player 3", color: "YELLOW", isBot: false, avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=YELLOW" },
  { id: "BLUE", name: "Player 4", color: "BLUE", isBot: false, avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=BLUE" },
];

export default function Main_Board() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTheme = location.state?.theme || getSavedTheme();

  // Players configuration from Dashboard (2, 3, or 4 players; with possible Bots)
  const players = location.state?.playersConfig || DEFAULT_PLAYERS;
  const activeColorIds = players.map((p) => p.color);

  // Initialize tokens ONLY for active players
  const [tokens, setTokens] = useState(() => {
    const initialTokens = {};
    activeColorIds.forEach((c) => {
      initialTokens[c] = [
        { state: "yard", stepCount: 0 },
        { state: "yard", stepCount: 0 },
        { state: "yard", stepCount: 0 },
        { state: "yard", stepCount: 0 },
      ];
    });
    return initialTokens;
  });

  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState(6);
  const [isRolling, setIsRolling] = useState(false);
  const [turnPhase, setTurnPhase] = useState("WAITING_ROLL"); // 'WAITING_ROLL', 'ROLLING', 'SELECT_MOVE', 'MOVING'
  const [movableIndices, setMovableIndices] = useState([]);
  const [consecutiveSixes, setConsecutiveSixes] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Roll the dice to start!");
  const [rankings, setRankings] = useState([]); // Finished players in order
  const [isGameOver, setIsGameOver] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const isMovingRef = useRef(false);

  const currentPlayer = players[activePlayerIndex];

  // Map active players to their corner positions
  const getPlayerByColor = (color) => players.find((p) => p.color === color);
  const redPlayer = getPlayerByColor("RED");
  const greenPlayer = getPlayerByColor("GREEN");
  const yellowPlayer = getPlayerByColor("YELLOW");
  const bluePlayer = getPlayerByColor("BLUE");

  // ====================================================
  // Automatic Bot Roll Trigger
  // ====================================================
  useEffect(() => {
    if (isGameOver) return;
    if (currentPlayer?.isBot && turnPhase === "WAITING_ROLL" && !isRolling) {
      const botTimer = setTimeout(() => {
        handleRollDice();
      }, 700);
      return () => clearTimeout(botTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePlayerIndex, turnPhase, isGameOver, isRolling]);

  // ====================================================
  // Turn Advance Helper
  // ====================================================
  const advanceTurn = (nextRankings = rankings) => {
    const nextFinishedIds = nextRankings.map((p) => p.id);
    const nextColorId = getNextPlayerId(activeColorIds, currentPlayer.color, nextFinishedIds);
    const nextIdx = players.findIndex((p) => p.color === nextColorId);

    setActivePlayerIndex(nextIdx);
    setConsecutiveSixes(0);
    setMovableIndices([]);
    setTurnPhase("WAITING_ROLL");
    const nextPlayerObj = players[nextIdx];
    setStatusMessage(
      nextPlayerObj.isBot
        ? `🤖 ${nextPlayerObj.name}'s Turn (Thinking...)`
        : `${nextPlayerObj.name}'s Turn - Roll the dice!`
    );
  };

  // ====================================================
  // 1. Roll Dice Action
  // ====================================================
  const handleRollDice = () => {
    if (turnPhase !== "WAITING_ROLL" || isRolling || isGameOver) return;

    audioManager.playDiceRoll();
    setIsRolling(true);
    setTurnPhase("ROLLING");
    setStatusMessage(`${currentPlayer.name} is rolling...`);

    // Rapid visual rolling animation
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 65);

    setTimeout(() => {
      clearInterval(rollInterval);
      const finalRoll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalRoll);
      setIsRolling(false);
      evaluateRollResult(finalRoll);
    }, 550);
  };

  // ====================================================
  // 2. Evaluate Roll & Movable Tokens (AI & Auto-move)
  // ====================================================
  const evaluateRollResult = (rolledNumber) => {
    let nextSixes = rolledNumber === 6 ? consecutiveSixes + 1 : 0;
    setConsecutiveSixes(nextSixes);

    // Rule of 3 consecutive 6s
    if (nextSixes === 3) {
      setStatusMessage("⚠️ Three 6s in a row! Turn forfeited.");
      setTimeout(() => {
        advanceTurn();
      }, 1100);
      return;
    }

    const movables = getMovableTokenIndices(tokens, currentPlayer.color, rolledNumber);
    setMovableIndices(movables);

    if (movables.length === 0) {
      setStatusMessage(currentPlayer.isBot ? `🤖 ${currentPlayer.name} has no moves!` : "No moves possible!");
      setTimeout(() => {
        advanceTurn();
      }, 950);
      return;
    }

    // AUTO-MOVE: If exactly 1 piece can move, auto-run for human and bot!
    if (movables.length === 1) {
      setTurnPhase("MOVING");
      setStatusMessage(currentPlayer.isBot ? `🤖 ${currentPlayer.name} moving piece...` : "Auto-running piece...");
      const singleTokenIndex = movables[0];
      setTimeout(() => {
        executeMoveToken(currentPlayer.color, singleTokenIndex, rolledNumber);
      }, 350);
      return;
    }

    // Bot AI choice for multiple moves
    if (currentPlayer.isBot) {
      setTurnPhase("MOVING");
      setStatusMessage(`🤖 ${currentPlayer.name} choosing best move...`);
      const botChosenIndex = chooseBestBotMove(currentPlayer.color, movables, tokens, rolledNumber);
      setTimeout(() => {
        executeMoveToken(currentPlayer.color, botChosenIndex, rolledNumber);
      }, 500);
      return;
    }

    // Human player: Multiple pieces can move $\rightarrow$ prompt click
    setTurnPhase("SELECT_MOVE");
    setStatusMessage(`${currentPlayer.name}, pick a piece to move!`);
  };

  // Manual token click (Human only)
  const handleTokenClick = (color, tokenIndex) => {
    if (currentPlayer.isBot) return;
    if (isMovingRef.current) return;
    if (turnPhase !== "SELECT_MOVE") return;
    if (color !== currentPlayer.color) return;
    if (!movableIndices.includes(tokenIndex)) return;

    setTurnPhase("MOVING");
    executeMoveToken(color, tokenIndex, diceValue);
  };

  // ====================================================
  // 3. Step-by-Step Token Movement Animation
  // ====================================================
  const executeMoveToken = (color, tokenIndex, stepsToMove) => {
    if (isMovingRef.current) return;
    isMovingRef.current = true;
    setMovableIndices([]);

    const token = tokens[color][tokenIndex];

    if (token.state === "yard") {
      // Unlocking from yard to Start Square (1 instant step)
      audioManager.playTokenStep();
      const updatedTokens = {
        ...tokens,
        [color]: tokens[color].map((t, i) =>
          i === tokenIndex ? { state: "track", stepCount: 0 } : t
        ),
      };
      setTokens(updatedTokens);

      setTimeout(() => {
        isMovingRef.current = false;
        postMoveCheck(updatedTokens, color, tokenIndex, true /* rolled 6 */);
      }, 300);
      return;
    }

    // Active token moving forward step-by-step
    let currentStep = token.stepCount;
    const targetStep = currentStep + stepsToMove;

    const stepInterval = setInterval(() => {
      currentStep += 1;
      audioManager.playTokenStep();

      setTokens((prev) => ({
        ...prev,
        [color]: prev[color].map((t, i) =>
          i === tokenIndex
            ? {
                state:
                  currentStep === TOTAL_STEPS_TO_HOME
                    ? "home"
                    : currentStep >= 51
                    ? "home_stretch"
                    : "track",
                stepCount: currentStep,
              }
            : t
        ),
      }));

      if (currentStep >= targetStep) {
        clearInterval(stepInterval);
        setTimeout(() => {
          isMovingRef.current = false;
          setTokens((finalTokens) => {
            postMoveCheck(finalTokens, color, tokenIndex, stepsToMove === 6);
            return finalTokens;
          });
        }, 180);
      }
    }, 150);
  };

  // ====================================================
  // 4. Post-Move Rules (Capture, Home, Bonus Rolls, Win)
  // ====================================================
  const postMoveCheck = (currentTokens, color, tokenIndex, rolledSix) => {
    const movedToken = currentTokens[color][tokenIndex];
    let extraRoll = false;

    // Check if entered Home
    if (movedToken.state === "home") {
      audioManager.playHomeEntry();
      setStatusMessage("👑 Token reached Home! Bonus Roll!");
      extraRoll = true;

      // Check if player completed all 4 tokens
      if (isPlayerWinner(currentTokens[color])) {
        const nextRankings = [...rankings, currentPlayer];
        setRankings(nextRankings);
        setStatusMessage(`🎉 ${currentPlayer.name} Finished in ${nextRankings.length === 1 ? "1st" : nextRankings.length === 2 ? "2nd" : "3rd"} Place!`);

        // Check if game is completely over
        if (nextRankings.length >= players.length - 1) {
          audioManager.playVictory();
          setIsGameOver(true);
          return;
        }
      }
    } else {
      // Check Capture on track
      const targetPos = getTokenGridPosition(color, tokenIndex, movedToken);
      const capturedInfo = checkCapture(currentTokens, color, targetPos, movedToken.state);

      if (capturedInfo) {
        audioManager.playCapture();
        setStatusMessage(`⚔️ Captured ${capturedInfo.color} token! Bonus Roll!`);
        extraRoll = true;

        // Reset captured opponent token to yard
        setTokens((prev) => ({
          ...prev,
          [capturedInfo.color]: prev[capturedInfo.color].map((t, i) =>
            i === capturedInfo.tokenIndex ? { state: "yard", stepCount: 0 } : t
          ),
        }));
      }
    }

    // Check bonus roll for 6
    if (rolledSix) {
      extraRoll = true;
      setStatusMessage("🎲 Rolled a 6! Roll Again!");
    }

    // Turn resolution
    if (extraRoll && !isPlayerWinner(currentTokens[color])) {
      setTurnPhase("WAITING_ROLL");
      setMovableIndices([]);
    } else {
      advanceTurn();
    }
  };

  // Restart match with current players
  const handleRestartMatch = () => {
    audioManager.playButtonClick();
    setShowSettings(false);
    setIsGameOver(false);
    setRankings([]);
    setActivePlayerIndex(0);
    setConsecutiveSixes(0);
    setMovableIndices([]);
    setTurnPhase("WAITING_ROLL");
    setStatusMessage("Match Restarted! Roll the dice.");

    const resetTokens = {};
    activeColorIds.forEach((c) => {
      resetTokens[c] = [
        { state: "yard", stepCount: 0 },
        { state: "yard", stepCount: 0 },
        { state: "yard", stepCount: 0 },
        { state: "yard", stepCount: 0 },
      ];
    });
    setTokens(resetTokens);
  };

  const handleReturnToMenu = () => {
    audioManager.playButtonClick();
    navigate("/");
  };

  return (
    <div
      className="ludo-game-screen"
      style={{
        backgroundImage: currentTheme.boardBg,
      }}
    >
      {/* Top Game Navigation Header */}
      <header className="game-top-bar">
        <button className="btn-game-nav" onClick={() => navigate("/")}>
          ↩ Exit
        </button>

        <div className="match-status-banner">
          <span className="live-badge">MATCH IN PROGRESS ({players.length} PLAYERS)</span>
          <span className="current-turn-indicator">
            {statusMessage}
          </span>
        </div>

        <button
          className="btn-game-nav"
          onClick={() => {
            audioManager.playButtonClick();
            setShowSettings(true);
          }}
        >
          ⚙️ Rules
        </button>
      </header>

      {/* Main Game Stage Layout */}
      <main className="game-stage">
        {/* Left Side: Top-Left (Red) & Bottom-Left (Blue) */}
        <section className="side-column left-column">
          {redPlayer ? (
            <PlayerCard
              player={redPlayer}
              isActive={currentPlayer.color === "RED"}
              isRolling={isRolling}
              diceValue={diceValue}
              canRoll={currentPlayer.color === "RED" && turnPhase === "WAITING_ROLL" && !redPlayer.isBot}
              onRoll={handleRollDice}
              statusText={
                currentPlayer.color === "RED" ? (turnPhase === "SELECT_MOVE" ? "Pick Token" : redPlayer.isBot ? "Bot Rolling..." : "Your Turn") : ""
              }
              finishedRank={rankings.findIndex((p) => p.id === redPlayer.id) + 1 || null}
              tokens={tokens.RED}
            />
          ) : (
            <div className="player-slot-empty" />
          )}

          {bluePlayer ? (
            <PlayerCard
              player={bluePlayer}
              isActive={currentPlayer.color === "BLUE"}
              isRolling={isRolling}
              diceValue={diceValue}
              canRoll={currentPlayer.color === "BLUE" && turnPhase === "WAITING_ROLL" && !bluePlayer.isBot}
              onRoll={handleRollDice}
              statusText={
                currentPlayer.color === "BLUE" ? (turnPhase === "SELECT_MOVE" ? "Pick Token" : bluePlayer.isBot ? "Bot Rolling..." : "Your Turn") : ""
              }
              finishedRank={rankings.findIndex((p) => p.id === bluePlayer.id) + 1 || null}
              tokens={tokens.BLUE}
            />
          ) : (
            <div className="player-slot-empty" />
          )}
        </section>

        {/* Center: Ludo Board */}
        <section className="board-center-area">
          <LudoBoard
            tokens={tokens}
            activePlayerColor={currentPlayer.color}
            movableTokenIndices={movableIndices}
            onTokenClick={handleTokenClick}
          />
        </section>

        {/* Right Side: Top-Right (Green) & Bottom-Right (Yellow) */}
        <section className="side-column right-column">
          {greenPlayer ? (
            <PlayerCard
              player={greenPlayer}
              isActive={currentPlayer.color === "GREEN"}
              isRolling={isRolling}
              diceValue={diceValue}
              canRoll={currentPlayer.color === "GREEN" && turnPhase === "WAITING_ROLL" && !greenPlayer.isBot}
              onRoll={handleRollDice}
              statusText={
                currentPlayer.color === "GREEN" ? (turnPhase === "SELECT_MOVE" ? "Pick Token" : greenPlayer.isBot ? "Bot Rolling..." : "Your Turn") : ""
              }
              finishedRank={rankings.findIndex((p) => p.id === greenPlayer.id) + 1 || null}
              tokens={tokens.GREEN}
            />
          ) : (
            <div className="player-slot-empty" />
          )}

          {yellowPlayer ? (
            <PlayerCard
              player={yellowPlayer}
              isActive={currentPlayer.color === "YELLOW"}
              isRolling={isRolling}
              diceValue={diceValue}
              canRoll={currentPlayer.color === "YELLOW" && turnPhase === "WAITING_ROLL" && !yellowPlayer.isBot}
              onRoll={handleRollDice}
              statusText={
                currentPlayer.color === "YELLOW" ? (turnPhase === "SELECT_MOVE" ? "Pick Token" : yellowPlayer.isBot ? "Bot Rolling..." : "Your Turn") : ""
              }
              finishedRank={rankings.findIndex((p) => p.id === yellowPlayer.id) + 1 || null}
              tokens={tokens.YELLOW}
            />
          ) : (
            <div className="player-slot-empty" />
          )}
        </section>
      </main>

      {/* Victory Celebration Modal */}
      {isGameOver && (
        <VictoryModal
          rankings={rankings}
          allPlayers={players}
          onPlayAgain={handleRestartMatch}
          onMainMenu={handleReturnToMenu}
        />
      )}

      {/* Settings & Rules Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onRestart={handleRestartMatch}
        onExit={handleReturnToMenu}
      />
    </div>
  );
}