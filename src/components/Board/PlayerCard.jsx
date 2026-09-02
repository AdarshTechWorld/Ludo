import React from "react";
import "./PlayerCard.css";
import Dice from "./Dice";
import { PLAYER_CONFIGS } from "../../utils/ludoConstants";

export default function PlayerCard({
  player,
  isActive = false,
  isRolling = false,
  diceValue = 6,
  onRoll,
  canRoll = false,
  statusText = "",
  finishedRank = null,
  tokens = [],
}) {
  const config = PLAYER_CONFIGS[player.color];
  const finishedCount = tokens ? tokens.filter((t) => t.state === "home").length : 0;

  return (
    <div
      className={`player-card-box ${isActive ? "active-turn" : "waiting-turn"} ${
        finishedRank ? "finished" : ""
      }`}
      style={{
        borderColor: isActive ? "#FFD700" : "rgba(255,255,255,0.18)",
      }}
    >
      {/* Finished Rank Trophy Badge */}
      {finishedRank && (
        <div className="rank-badge">
          {finishedRank === 1 && "🥇 1st"}
          {finishedRank === 2 && "🥈 2nd"}
          {finishedRank === 3 && "🥉 3rd"}
          {finishedRank === 4 && "4th"}
        </div>
      )}

      {/* Header Info: Avatar + Name + Bot tag + Home count */}
      <div className="player-header">
        <div
          className="player-avatar-ring"
          style={{
            borderColor: config.color,
            boxShadow: isActive ? `0 0 14px ${config.color}` : "none",
          }}
        >
          <img
            src={player.avatar || `https://api.dicebear.com/9.x/bottts/svg?seed=${player.name}`}
            alt={player.name}
            className="player-avatar-img"
          />
        </div>

        <div className="player-details">
          <div className="player-name-row">
            <span className="player-name-text" title={player.name}>
              {player.name}
            </span>
            {player.isBot && <span className="badge-bot">BOT</span>}
          </div>
          <div className="finished-tokens-row">
            {[0, 1, 2, 3].map((idx) => (
              <span
                key={idx}
                className={`token-status-dot ${idx < finishedCount ? "completed" : ""}`}
                style={{
                  backgroundColor: idx < finishedCount ? config.color : "rgba(255,255,255,0.2)",
                  borderColor: idx < finishedCount ? "#fff" : "transparent",
                }}
              />
            ))}
            <span className="finished-ratio">{finishedCount}/4</span>
          </div>
        </div>
      </div>

      {/* Center Action: Dice roller shown ONLY for active player */}
      <div className="player-dice-area">
        {isActive && !finishedRank ? (
          <Dice
            value={diceValue}
            isRolling={isRolling}
            canRoll={canRoll && !player.isBot}
            onRoll={onRoll}
          />
        ) : (
          <div className="dice-placeholder">
            <span className="waiting-pill">
              {finishedRank ? "Finished" : player.isBot ? "Bot Waiting" : "Waiting"}
            </span>
          </div>
        )}
      </div>

      {/* Turn status indicator message */}
      <div
        className="turn-status-bar"
        style={{
          color: isActive ? "#FFD700" : "rgba(255,255,255,0.5)",
        }}
      >
        {statusText || (isActive ? (player.isBot ? "Bot's Turn" : "Your Turn") : "Waiting")}
      </div>
    </div>
  );
}
