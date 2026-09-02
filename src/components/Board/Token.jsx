import React from "react";
import "./Token.css";
import { PLAYER_CONFIGS } from "../../utils/ludoConstants";

export default function Token({
  color,
  tokenIndex,
  isMovable,
  onClick,
  stackCount = 1,
  stackIndex = 0,
}) {
  const config = PLAYER_CONFIGS[color];

  // Offset slightly if stacked with multiple pawns
  const offsetX = stackCount > 1 ? (stackIndex % 2 === 0 ? -6 : 6) : 0;
  const offsetY = stackCount > 1 ? (stackIndex < 2 ? -6 : 6) : 0;
  const scale = stackCount > 1 ? 0.78 : 1;

  return (
    <div
      className={`ludo-token-wrapper ${isMovable ? "movable" : ""}`}
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
        zIndex: isMovable ? 50 : 10 + stackIndex,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (isMovable && onClick) {
          onClick(tokenIndex);
        }
      }}
      role="button"
      tabIndex={isMovable ? 0 : -1}
    >
      {/* 3D Pawn Body */}
      <div
        className="ludo-token"
        style={{
          background: config.tokenGradient,
          boxShadow: `0 4px 10px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -3px 5px rgba(0,0,0,0.4)`,
          borderColor: config.lightColor,
        }}
      >
        <div className="token-crown" style={{ backgroundColor: config.lightColor }} />
        <div className="token-shine" />
      </div>

      {/* Pulsing indicator when movable */}
      {isMovable && <div className="token-pulse-ring" />}

      {/* Multi-token stack badge count */}
      {stackCount > 1 && stackIndex === 0 && (
        <div className="token-stack-badge">{stackCount}</div>
      )}
    </div>
  );
}

