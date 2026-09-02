import React from "react";
import "./LudoBoard.css";
import Token from "./Token";
import { PLAYER_CONFIGS, SAFE_CELLS } from "../../utils/ludoConstants";
import { getTokenGridPosition } from "../../utils/ludoLogic";

export default function LudoBoard({
  tokens = {},
  activePlayerColor,
  movableTokenIndices = [],
  onTokenClick,
}) {
  // Check cell properties
  const isStartCell = (r, c) => {
    if (r === 6 && c === 1) return PLAYER_CONFIGS.RED;
    if (r === 1 && c === 8) return PLAYER_CONFIGS.GREEN;
    if (r === 8 && c === 13) return PLAYER_CONFIGS.YELLOW;
    if (r === 13 && c === 6) return PLAYER_CONFIGS.BLUE;
    return null;
  };

  const isStarCell = (r, c) => {
    return SAFE_CELLS.some(
      (cell) => cell.label.startsWith("star") && cell.row === r && cell.col === c
    );
  };

  const isHomePathCell = (r, c) => {
    if (r === 7 && c >= 1 && c <= 5) return PLAYER_CONFIGS.RED;
    if (c === 7 && r >= 1 && r <= 5) return PLAYER_CONFIGS.GREEN;
    if (r === 7 && c >= 9 && c <= 13) return PLAYER_CONFIGS.YELLOW;
    if (c === 7 && r >= 9 && r <= 13) return PLAYER_CONFIGS.BLUE;
    return null;
  };

  // Build list of active tokens with their current grid row/col
  const activeTokensList = [];
  Object.keys(tokens).forEach((color) => {
    if (tokens[color] && Array.isArray(tokens[color])) {
      tokens[color].forEach((tok, idx) => {
        const pos = getTokenGridPosition(color, idx, tok);
        const isMovable =
          color === activePlayerColor && movableTokenIndices.includes(idx);
        activeTokensList.push({
          color,
          tokenIndex: idx,
          tokenState: tok,
          pos,
          isMovable,
        });
      });
    }
  });

  // Group tokens sharing same location (stacking)
  const groupedTokens = {};
  activeTokensList.forEach((item) => {
    const key = `${item.pos.row.toFixed(1)}_${item.pos.col.toFixed(1)}`;
    if (!groupedTokens[key]) groupedTokens[key] = [];
    groupedTokens[key].push(item);
  });

  return (
    <div className="ludo-board-frame">
      <div className="ludo-board-grid">
        {/* =========================================
            1. FOUR CORNER HOME YARDS
           ========================================= */}
        {/* Top-Left Red Yard */}
        <div className="home-yard top-left red-yard">
          <div className="yard-inner-card">
            <div className="yard-circle-pocket pocket-0" />
            <div className="yard-circle-pocket pocket-1" />
            <div className="yard-circle-pocket pocket-2" />
            <div className="yard-circle-pocket pocket-3" />
          </div>
        </div>

        {/* Top-Right Green Yard */}
        <div className="home-yard top-right green-yard">
          <div className="yard-inner-card">
            <div className="yard-circle-pocket pocket-0" />
            <div className="yard-circle-pocket pocket-1" />
            <div className="yard-circle-pocket pocket-2" />
            <div className="yard-circle-pocket pocket-3" />
          </div>
        </div>

        {/* Bottom-Left Blue Yard */}
        <div className="home-yard bottom-left blue-yard">
          <div className="yard-inner-card">
            <div className="yard-circle-pocket pocket-0" />
            <div className="yard-circle-pocket pocket-1" />
            <div className="yard-circle-pocket pocket-2" />
            <div className="yard-circle-pocket pocket-3" />
          </div>
        </div>

        {/* Bottom-Right Yellow Yard */}
        <div className="home-yard bottom-right yellow-yard">
          <div className="yard-inner-card">
            <div className="yard-circle-pocket pocket-0" />
            <div className="yard-circle-pocket pocket-1" />
            <div className="yard-circle-pocket pocket-2" />
            <div className="yard-circle-pocket pocket-3" />
          </div>
        </div>

        {/* =========================================
            2. 15x15 TRACK CELLS
           ========================================= */}
        {Array.from({ length: 15 }).map((_, r) =>
          Array.from({ length: 15 }).map((_, c) => {
            // Ignore corner yards (0..5, 0..5), (0..5, 9..14), etc.
            if (
              (r < 6 && c < 6) ||
              (r < 6 && c > 8) ||
              (r > 8 && c < 6) ||
              (r > 8 && c > 8)
            ) {
              return null;
            }

            // Center 3x3 Home Triangle area
            if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
              return null;
            }

            const startConfig = isStartCell(r, c);
            const homePathConfig = isHomePathCell(r, c);
            const hasStar = isStarCell(r, c);

            let cellBg = "#ffffff";
            let arrowSymbol = null;

            if (startConfig) {
              cellBg = startConfig.color;
              if (r === 6 && c === 1) arrowSymbol = "➔";
              if (r === 1 && c === 8) arrowSymbol = "🠓";
              if (r === 8 && c === 13) arrowSymbol = "🠔";
              if (r === 13 && c === 6) arrowSymbol = "🠕";
            } else if (homePathConfig) {
              cellBg = homePathConfig.color;
            }

            return (
              <div
                key={`${r}-${c}`}
                className={`ludo-track-cell ${hasStar ? "star-cell" : ""}`}
                style={{
                  gridRowStart: r + 1,
                  gridColumnStart: c + 1,
                  backgroundColor: cellBg,
                }}
              >
                {hasStar && <span className="star-icon">★</span>}
                {arrowSymbol && <span className="arrow-icon">{arrowSymbol}</span>}
              </div>
            );
          })
        )}

        {/* =========================================
            3. CENTER HOME TRIANGLES
           ========================================= */}
        <div className="center-home-container">
          <div className="center-triangle red-triangle" />
          <div className="center-triangle green-triangle" />
          <div className="center-triangle yellow-triangle" />
          <div className="center-triangle blue-triangle" />
          <div className="center-crown-emblem">👑</div>
        </div>

        {/* =========================================
            4. DYNAMIC TOKENS LAYER
           ========================================= */}
        {Object.entries(groupedTokens).map(([key, group]) => {
          const sample = group[0];
          // Grid percentage positioning (15 columns/rows = 100% / 15)
          const topPercent = (sample.pos.row / 15) * 100;
          const leftPercent = (sample.pos.col / 15) * 100;

          return (
            <div
              key={key}
              className="token-cell-anchor"
              style={{
                top: `${topPercent}%`,
                left: `${leftPercent}%`,
                width: `${100 / 15}%`,
                height: `${100 / 15}%`,
              }}
            >
              {group.map((item, stackIdx) => (
                <Token
                  key={`${item.color}-${item.tokenIndex}`}
                  color={item.color}
                  tokenIndex={item.tokenIndex}
                  isMovable={item.isMovable}
                  onClick={(idx) => onTokenClick(item.color, idx)}
                  stackCount={group.length}
                  stackIndex={stackIdx}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
