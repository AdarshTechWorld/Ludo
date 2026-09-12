/**
 * Ludo King Themes Definition & Persistence Manager
 */

import woodBg from "../assets/images/wooden_board.png";
import landscapeBg from "../assets/images/landscape.png";

export const THEMES = [
  {
    id: "ROYAL_MIDNIGHT",
    name: "Royal Midnight",
    icon: "👑",
    accentColor: "#ffd700",
    previewGradient: "linear-gradient(135deg, #101a3c, #060a18)",
    dashboardBg: `radial-gradient(circle at 50% 30%, rgba(20, 32, 70, 0.8) 0%, rgba(6, 10, 24, 0.98) 100%), url(${landscapeBg})`,
    boardBg: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${landscapeBg})`,
    cardBorder: "#ffd700",
    description: "Classic royal midnight with luxury golden trim",
  },
  {
    id: "CLASSIC_WOOD",
    name: "Classic Wooden",
    icon: "🪵",
    accentColor: "#f59e0b",
    previewGradient: "linear-gradient(135deg, #78350f, #291104)",
    dashboardBg: `radial-gradient(circle at 50% 30%, rgba(60, 26, 10, 0.8) 0%, rgba(20, 8, 3, 0.96) 100%), url(${woodBg})`,
    boardBg: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${woodBg})`,
    cardBorder: "#f59e0b",
    description: "Authentic mahogany wood grain & warm golden luster",
  },
  {
    id: "COSMIC_NEON",
    name: "Cosmic Neon",
    icon: "🌌",
    accentColor: "#00e5ff",
    previewGradient: "linear-gradient(135deg, #2e0854, #05011a)",
    dashboardBg: `radial-gradient(circle at 50% 30%, rgba(55, 10, 95, 0.85) 0%, rgba(3, 1, 15, 0.98) 100%), url(${landscapeBg})`,
    boardBg: `radial-gradient(circle at center, rgba(30, 5, 55, 0.8) 0%, rgba(4, 1, 15, 0.95) 100%), url(${landscapeBg})`,
    cardBorder: "#00e5ff",
    description: "Deep space cyber galaxy with glowing neon pulses",
  },
  {
    id: "EMERALD_NATURE",
    name: "Emerald Jungle",
    icon: "🌿",
    accentColor: "#00e676",
    previewGradient: "linear-gradient(135deg, #064e3b, #022c22)",
    dashboardBg: `radial-gradient(circle at 50% 30%, rgba(6, 78, 59, 0.85) 0%, rgba(2, 35, 28, 0.98) 100%), url(${landscapeBg})`,
    boardBg: `linear-gradient(rgba(2, 44, 34, 0.7), rgba(2, 44, 34, 0.85)), url(${landscapeBg})`,
    cardBorder: "#00e676",
    description: "Lush tropical rainforest with radiant emerald aura",
  },
  {
    id: "OCEAN_SAPPHIRE",
    name: "Ocean Abyss",
    icon: "🌊",
    accentColor: "#38bdf8",
    previewGradient: "linear-gradient(135deg, #0c4a6e, #031c2e)",
    dashboardBg: `radial-gradient(circle at 50% 30%, rgba(12, 74, 110, 0.85) 0%, rgba(3, 25, 42, 0.98) 100%), url(${landscapeBg})`,
    boardBg: `linear-gradient(rgba(3, 28, 46, 0.75), rgba(3, 28, 46, 0.9)), url(${landscapeBg})`,
    cardBorder: "#38bdf8",
    description: "Deep oceanic sapphire with radiant water glow",
  },
];

const THEME_STORAGE_KEY = "LUDO_SELECTED_THEME_ID";

export function getSavedTheme() {
  if (typeof window !== "undefined") {
    const savedId = localStorage.getItem(THEME_STORAGE_KEY);
    const found = THEMES.find((t) => t.id === savedId);
    if (found) return found;
  }
  return THEMES[0];
}

export function saveTheme(themeId) {
  if (typeof window !== "undefined") {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  }
}

