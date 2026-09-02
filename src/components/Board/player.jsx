import React from "react";
import "./Player.css";

export default function Player({ player, onDiceClick }) {
  return (
    <div className="player-card" style={{ background: player.color }}>
      <div className="profile">
        <img src={player.profileImage} alt={player.name} />
      </div>

      <h3 className="player-name">{player.name}</h3>

      <div className="pieces">
        {player.pieces.map((piece, index) => (
          <div key={index} className="piece">
            {piece}
          </div>
        ))}
      </div>

      <button className="dice" onClick={() => onDiceClick(player)}>
        {player.diceValue}
      </button>
    </div>
  );
}