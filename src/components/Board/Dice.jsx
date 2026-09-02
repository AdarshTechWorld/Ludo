import React from "react";
import "./Dice.css";
import dice1 from "../../assets/dice/dice-six-faces-one.png";
import dice2 from "../../assets/dice/dice-six-faces-two.png";
import dice3 from "../../assets/dice/dice-six-faces-three.png";
import dice4 from "../../assets/dice/dice-six-faces-four.png";
import dice5 from "../../assets/dice/dice-six-faces-five.png";
import dice6 from "../../assets/dice/dice-six-faces-six.png";

const DICE_IMAGES = {
  1: dice1,
  2: dice2,
  3: dice3,
  4: dice4,
  5: dice5,
  6: dice6,
};

export default function Dice({
  value = 6,
  isRolling = false,
  canRoll = false,
  onRoll,
}) {
  return (
    <div
      className={`ludo-dice-container ${canRoll ? "active-roller" : ""} ${
        isRolling ? "rolling" : ""
      }`}
      onClick={() => {
        if (canRoll && !isRolling && onRoll) {
          onRoll();
        }
      }}
      role="button"
      tabIndex={canRoll ? 0 : -1}
      style={{
        borderColor: canRoll ? "#FFD700" : "transparent",
      }}
    >
      <div className="dice-box">
        <img
          src={DICE_IMAGES[value] || dice6}
          alt={`Dice ${value}`}
          className="dice-face-image"
        />
      </div>

      {canRoll && !isRolling && (
        <div className="roll-prompt-badge">ROLL!</div>
      )}
    </div>
  );
}
