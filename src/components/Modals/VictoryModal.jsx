import React from "react";
import "./VictoryModal.css";
import { PLAYER_CONFIGS } from "../../utils/ludoConstants";

export default function VictoryModal({
  rankings = [], // array of player objects in order of finish [1st, 2nd, ...]
  allPlayers = [],
  onPlayAgain,
  onMainMenu,
}) {
  // Build final rank list (finished players + any remaining players)
  const rankedPlayerIds = rankings.map((p) => p.id);
  const remainingPlayers = allPlayers.filter((p) => !rankedPlayerIds.includes(p.id));
  const fullRankings = [...rankings, ...remainingPlayers];

  return (
    <div className="victory-modal-backdrop">
      <div className="victory-modal-card">
        {/* Confetti Elements */}
        <div className="confetti-container">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className={`confetti piece-${i % 6}`} />
          ))}
        </div>

        <div className="victory-header">
          <div className="trophy-badge">🏆</div>
          <h1 className="victory-title">MATCH FINISHED!</h1>
          <p className="victory-subtitle">Congratulations to the Champions!</p>
        </div>

        {/* Podium / Rankings List */}
        <div className="rankings-list">
          {fullRankings.map((player, index) => {
            const config = PLAYER_CONFIGS[player.color];
            const rank = index + 1;
            const medal =
              rank === 1 ? "🥇 1st Place" : rank === 2 ? "🥈 2nd Place" : rank === 3 ? "🥉 3rd Place" : "4th Place";

            return (
              <div
                key={player.id}
                className={`ranking-row rank-${rank}`}
                style={{
                  borderLeftColor: config.color,
                }}
              >
                <div className="rank-medal">{medal}</div>
                <div
                  className="rank-player-avatar"
                  style={{ borderColor: config.color }}
                >
                  <img
                    src={
                      player.avatar ||
                      `https://api.dicebear.com/9.x/bottts/svg?seed=${player.name}`
                    }
                    alt={player.name}
                  />
                </div>
                <div className="rank-player-name">{player.name}</div>
                <div
                  className="rank-player-color-tag"
                  style={{ background: config.color }}
                >
                  {config.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="victory-actions">
          <button className="btn-victory play-again" onClick={onPlayAgain}>
            🔄 Play Again
          </button>
          <button className="btn-victory main-menu" onClick={onMainMenu}>
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}

