/**
 * Ludo King Pure Game Logic & State Transition Engine
 */

import { PLAYER_CONFIGS, TRACK_COORDINATES, SAFE_CELLS, TOTAL_STEPS_TO_HOME } from "./ludoConstants";

/**
 * Checks if a coordinate on the board is a safe cell
 */
export function isSafePosition(row, col) {
  return SAFE_CELLS.some(
    (cell) => Math.abs(cell.row - row) < 0.1 && Math.abs(cell.col - col) < 0.1
  );
}

/**
 * Calculates current grid position { row, col } for a given token
 */
export function getTokenGridPosition(color, tokenIndex, token) {
  const config = PLAYER_CONFIGS[color];
  if (!config) return { row: 0, col: 0 };

  if (token.state === "yard") {
    return config.yardPockets[tokenIndex];
  }

  if (token.state === "home") {
    return config.homeCenter;
  }

  if (token.stepCount <= 50) {
    // On the 52-cell outer track
    const trackIndex = (config.startTrackIndex + token.stepCount) % 52;
    return TRACK_COORDINATES[trackIndex];
  }

  if (token.stepCount >= 51 && token.stepCount <= 55) {
    // Inside the 5-step Home Path
    const homePathIndex = token.stepCount - 51;
    return config.homePath[homePathIndex];
  }

  if (token.stepCount === TOTAL_STEPS_TO_HOME) {
    return config.homeCenter;
  }

  return config.homeCenter;
}

/**
 * Checks if a specific token can legally move with the given dice roll
 */
export function canTokenMove(token, diceValue) {
  if (token.state === "home") return false;

  if (token.state === "yard") {
    return diceValue === 6;
  }

  // Active on track or home stretch
  const targetStep = token.stepCount + diceValue;
  return targetStep <= TOTAL_STEPS_TO_HOME;
}

/**
 * Returns a list of token indices for the player that can legally move
 */
export function getMovableTokenIndices(tokens, color, diceValue) {
  const playerTokens = tokens[color];
  if (!playerTokens) return [];

  const movable = [];
  playerTokens.forEach((token, index) => {
    if (canTokenMove(token, diceValue)) {
      movable.push(index);
    }
  });

  return movable;
}

/**
 * Returns next target position and state for a single animation step
 */
export function getNextStepState(color, tokenIndex, currentStep) {
  const config = PLAYER_CONFIGS[color];
  const nextStep = currentStep + 1;

  if (nextStep === 0) {
    // Unlocking from yard to start cell
    return {
      stepCount: 0,
      state: "track",
      pos: config.startPos,
    };
  }

  if (nextStep <= 50) {
    const trackIndex = (config.startTrackIndex + nextStep) % 52;
    return {
      stepCount: nextStep,
      state: "track",
      pos: TRACK_COORDINATES[trackIndex],
    };
  }

  if (nextStep >= 51 && nextStep <= 55) {
    const homePathIndex = nextStep - 51;
    return {
      stepCount: nextStep,
      state: "home_stretch",
      pos: config.homePath[homePathIndex],
    };
  }

  if (nextStep === TOTAL_STEPS_TO_HOME) {
    return {
      stepCount: TOTAL_STEPS_TO_HOME,
      state: "home",
      pos: config.homeCenter,
    };
  }

  return {
    stepCount: currentStep,
    state: "home",
    pos: config.homeCenter,
  };
}

/**
 * Checks if landing at targetPos captures any opponent token
 * Returns captured token info or null
 */
export function checkCapture(tokens, movingColor, targetPos, targetState) {
  // Captures only happen on the outer common track
  if (targetState !== "track") return null;

  // Cannot capture on safe star or start squares
  if (isSafePosition(targetPos.row, targetPos.col)) return null;

  for (const [color, colorTokens] of Object.entries(tokens)) {
    if (color === movingColor) continue;

    for (let i = 0; i < colorTokens.length; i++) {
      const oppToken = colorTokens[i];
      if (oppToken.state === "track") {
        const oppPos = getTokenGridPosition(color, i, oppToken);
        if (
          Math.abs(oppPos.row - targetPos.row) < 0.1 &&
          Math.abs(oppPos.col - targetPos.col) < 0.1
        ) {
          return { color, tokenIndex: i };
        }
      }
    }
  }

  return null;
}

/**
 * Checks if a player has successfully gotten all 4 tokens home
 */
export function isPlayerWinner(playerTokens) {
  return playerTokens.every((token) => token.state === "home");
}

/**
 * Gets the next player in clockwise rotation who has not finished yet
 */
export function getNextPlayerId(activePlayerIds, currentId, finishedPlayerIds) {
  const currentIndex = activePlayerIds.indexOf(currentId);
  for (let i = 1; i <= activePlayerIds.length; i++) {
    const nextIndex = (currentIndex + i) % activePlayerIds.length;
    const candidate = activePlayerIds[nextIndex];
    if (!finishedPlayerIds.includes(candidate)) {
      return candidate;
    }
  }
  return currentId;
}

