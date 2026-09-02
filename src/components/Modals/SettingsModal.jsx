import React, { useState } from "react";
import "./SettingsModal.css";
import { audioManager } from "../../utils/audioManager";

export default function SettingsModal({
  isOpen,
  onClose,
  onRestart,
  onExit,
}) {
  const [isMuted, setIsMuted] = useState(audioManager.isMuted);

  if (!isOpen) return null;

  const handleToggleAudio = () => {
    const nextMuted = audioManager.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      audioManager.playButtonClick();
    }
  };

  return (
    <div className="settings-modal-backdrop" onClick={onClose}>
      <div className="settings-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ Game Settings & Rules</h2>
          <button className="btn-close-settings" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Audio Toggle */}
        <div className="settings-row">
          <div className="setting-info">
            <span className="setting-label">Sound Effects (SFX)</span>
            <span className="setting-desc">Dice rolls, pawn steps, captures & fanfares</span>
          </div>
          <button
            className={`btn-toggle-audio ${isMuted ? "muted" : "active"}`}
            onClick={handleToggleAudio}
          >
            {isMuted ? "🔇 Muted" : "🔊 Sound ON"}
          </button>
        </div>

        {/* Ludo King Quick Rules */}
        <div className="rules-section">
          <h3>📖 How to Play (Ludo King Rules)</h3>
          <ul className="rules-list">
            <li>
              🎲 <strong>Roll 6 to Unlock:</strong> Roll a 6 to take a token out of your yard onto the board.
            </li>
            <li>
              ⭐ <strong>Safe Zones (8 Stars/Starts):</strong> Tokens resting on star cells or start cells cannot be captured.
            </li>
            <li>
              ⚔️ <strong>Capture (Cut):</strong> Landing on an opponent token sends it back to their yard and rewards you an <strong>extra roll</strong>!
            </li>
            <li>
              🎁 <strong>Bonus Rolls:</strong> Rolling a 6, capturing an opponent, or entering Home grants an extra roll.
            </li>
            <li>
              ⚠️ <strong>Three 6s Rule:</strong> Rolling three consecutive 6s forfeits the 3rd roll and passes the turn.
            </li>
            <li>
              👑 <strong>Victory:</strong> The first player to bring all 4 tokens into the central Home triangle wins 1st place!
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button className="btn-action restart" onClick={onRestart}>
            🔄 Restart Match
          </button>
          <button className="btn-action exit" onClick={onExit}>
            🚪 Exit to Menu
          </button>
        </div>
      </div>
    </div>
  );
}

