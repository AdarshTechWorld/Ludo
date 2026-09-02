/**
 * Smart Ludo King AI Decision Engine
 */

import { PLAYER_CONFIGS, TOTAL_STEPS_TO_HOME } from "./ludoConstants";
import { getTokenGridPosition, checkCapture, isSafePosition } from "./ludoLogic";

/**
 * Evaluates the best token index to move for a computer bot
 * @param {string} botColor - 'RED', 'GREEN', 'YELLOW', 'BLUE'
 * @param {Array<number>} movableIndices - Array of token indices that can move [0, 1, 2, 3]
 * @param {Object} tokens - Complete tokens state across all players
 * @param {number} diceValue - The rolled dice value (1..6)
 * @returns {number} The chosen token index to move
 */
export function chooseBestBotMove(botColor, movableIndices, tokens, diceValue) {
  if (!movableIndices || movableIndices.length === 0) return null;
  if (movableIndices.length === 1) return movableIndices[0];

  const botTokens = tokens[botColor];
  let bestTokenIndex = movableIndices[0];
  let highestScore = -Infinity;

  movableIndices.forEach((tokenIdx) => {
    const token = botTokens[tokenIdx];
    let score = 0;

    // Case A: Unlocking token from yard
    if (token.state === "yard") {
      // Score high if few tokens are on track
      const tokensOnTrack = botTokens.filter((t) => t.state === "track" || t.state === "home_stretch").length;
      score = tokensOnTrack === 0 ? 100 : 50; // Getting first pawn out is urgent
    } else {
      const targetStep = token.stepCount + diceValue;

      // 1. Entering Final Home (Top Priority: 150 pts)
      if (targetStep === TOTAL_STEPS_TO_HOME) {
        score += 150;
      }

      // 2. Entering Home Stretch (Safe from all opponent attacks: 80 pts)
      else if (token.stepCount <= 50 && targetStep > 50) {
        score += 80;
      }

      // 3. Capturing Opponent Pawn (Huge Priority: 120 pts)
      if (targetStep <= 50) {
        // Calculate target coordinate
        const simulatedToken = { ...token, stepCount: targetStep, state: "track" };
        const targetPos = getTokenGridPosition(botColor, tokenIdx, simulatedToken);
        const capture = checkCapture(tokens, botColor, targetPos, "track");

        if (capture) {
          score += 120;
        }

        // 4. Landing on a Safe Star / Start square (40 pts)
        if (isSafePosition(targetPos.row, targetPos.col)) {
          score += 40;
        }

        // 5. Escaping Danger (If an opponent is 1-6 steps behind current position: 70 pts)
        const currentPos = getTokenGridPosition(botColor, tokenIdx, token);
        if (!isSafePosition(currentPos.row, currentPos.col)) {
          const isThreatened = checkThreat(tokens, botColor, currentPos);
          if (isThreatened) {
            score += 70;
          }
        }
      }

      // 6. General Forward Progress (prefer advancing further tokens: 1-50 pts)
      score += targetStep * 0.8;
    }

    if (score > highestScore) {
      highestScore = score;
      bestTokenIndex = tokenIdx;
    }
  });

  return bestTokenIndex;
}

/**
 * Checks if any opponent token is 1 to 6 steps behind a position
 */
function checkThreat(tokens, botColor, currentPos) {
  const botConfig = PLAYER_CONFIGS[botColor];
  if (!botConfig) return false;

  for (const [color, colorTokens] of Object.entries(tokens)) {
    if (color === botColor) continue;

    for (let i = 0; i < colorTokens.length; i++) {
      const oppTok = colorTokens[i];
      if (oppTok.state === "track") {
        const oppPos = getTokenGridPosition(color, i, oppTok);
        // Quick distance check
        const dist = Math.abs(oppPos.row - currentPos.row) + Math.abs(oppPos.col - currentPos.col);
        if (dist > 0 && dist <= 4) {
          return true;
        }
      }
    }
  }

  return false;
}

