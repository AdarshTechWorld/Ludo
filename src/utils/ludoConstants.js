/**
 * Ludo King Constants & Coordinate Systems
 * 15x15 Grid Layout: rows 0..14, cols 0..14
 */

export const PLAYER_CONFIGS = {
  RED: {
    id: "RED",
    name: "Red",
    color: "#E53935",
    darkColor: "#B71C1C",
    lightColor: "#FFCDD2",
    accentColor: "#FF8A80",
    gradient: "linear-gradient(135deg, #FF5252, #D32F2F)",
    tokenGradient: "radial-gradient(circle at 35% 35%, #FF8A80, #D32F2F 60%, #850000 100%)",
    startTrackIndex: 0,
    startPos: { row: 6, col: 1 },
    homeEntryTrackIndex: 50,
    homePath: [
      { row: 7, col: 1 },
      { row: 7, col: 2 },
      { row: 7, col: 3 },
      { row: 7, col: 4 },
      { row: 7, col: 5 },
    ],
    homeCenter: { row: 7, col: 6 },
    yardPockets: [
      { row: 1.5, col: 1.5 },
      { row: 1.5, col: 3.5 },
      { row: 3.5, col: 1.5 },
      { row: 3.5, col: 3.5 },
    ],
    yardBounds: { startRow: 0, endRow: 5, startCol: 0, endCol: 5 },
    corner: "top-left",
  },
  GREEN: {
    id: "GREEN",
    name: "Green",
    color: "#43A047",
    darkColor: "#1B5E20",
    lightColor: "#C8E6C9",
    accentColor: "#B9F6CA",
    gradient: "linear-gradient(135deg, #69F0AE, #2E7D32)",
    tokenGradient: "radial-gradient(circle at 35% 35%, #B9F6CA, #2E7D32 60%, #0D3E10 100%)",
    startTrackIndex: 13,
    startPos: { row: 1, col: 8 },
    homeEntryTrackIndex: 11,
    homePath: [
      { row: 1, col: 7 },
      { row: 2, col: 7 },
      { row: 3, col: 7 },
      { row: 4, col: 7 },
      { row: 5, col: 7 },
    ],
    homeCenter: { row: 6, col: 7 },
    yardPockets: [
      { row: 1.5, col: 10.5 },
      { row: 1.5, col: 12.5 },
      { row: 3.5, col: 10.5 },
      { row: 3.5, col: 12.5 },
    ],
    yardBounds: { startRow: 0, endRow: 5, startCol: 9, endCol: 14 },
    corner: "top-right",
  },
  YELLOW: {
    id: "YELLOW",
    name: "Yellow",
    color: "#FDD835",
    darkColor: "#F57F17",
    lightColor: "#FFF9C4",
    accentColor: "#FFFF8D",
    gradient: "linear-gradient(135deg, #FFEE58, #F57F17)",
    tokenGradient: "radial-gradient(circle at 35% 35%, #FFFF8D, #FBC02D 60%, #9C6400 100%)",
    startTrackIndex: 26,
    startPos: { row: 8, col: 13 },
    homeEntryTrackIndex: 24,
    homePath: [
      { row: 7, col: 13 },
      { row: 7, col: 12 },
      { row: 7, col: 11 },
      { row: 7, col: 10 },
      { row: 7, col: 9 },
    ],
    homeCenter: { row: 7, col: 8 },
    yardPockets: [
      { row: 10.5, col: 10.5 },
      { row: 10.5, col: 12.5 },
      { row: 12.5, col: 10.5 },
      { row: 12.5, col: 12.5 },
    ],
    yardBounds: { startRow: 9, endRow: 14, startCol: 9, endCol: 14 },
    corner: "bottom-right",
  },
  BLUE: {
    id: "BLUE",
    name: "Blue",
    color: "#1E88E5",
    darkColor: "#0D47A1",
    lightColor: "#BBDEFB",
    accentColor: "#82B1FF",
    gradient: "linear-gradient(135deg, #448AFF, #1565C0)",
    tokenGradient: "radial-gradient(circle at 35% 35%, #82B1FF, #1565C0 60%, #052654 100%)",
    startTrackIndex: 39,
    startPos: { row: 13, col: 6 },
    homeEntryTrackIndex: 37,
    homePath: [
      { row: 13, col: 7 },
      { row: 12, col: 7 },
      { row: 11, col: 7 },
      { row: 10, col: 7 },
      { row: 9, col: 7 },
    ],
    homeCenter: { row: 8, col: 7 },
    yardPockets: [
      { row: 10.5, col: 1.5 },
      { row: 10.5, col: 3.5 },
      { row: 12.5, col: 1.5 },
      { row: 12.5, col: 3.5 },
    ],
    yardBounds: { startRow: 9, endRow: 14, startCol: 0, endCol: 5 },
    corner: "bottom-left",
  },
};

// 52 Common Outer Track Cells (Clockwise)
export const TRACK_COORDINATES = [
  // Red side moving Right (0..4)
  { row: 6, col: 1 }, // 0: Red Start
  { row: 6, col: 2 }, // 1
  { row: 6, col: 3 }, // 2
  { row: 6, col: 4 }, // 3
  { row: 6, col: 5 }, // 4

  // Turning UP along Green Yard left (5..10)
  { row: 5, col: 6 }, // 5
  { row: 4, col: 6 }, // 6
  { row: 3, col: 6 }, // 7
  { row: 2, col: 6 }, // 8: Safe Star 1
  { row: 1, col: 6 }, // 9
  { row: 0, col: 6 }, // 10

  // Across Top (11..12)
  { row: 0, col: 7 }, // 11
  { row: 0, col: 8 }, // 12

  // Turning DOWN along Green Yard right (13..17)
  { row: 1, col: 8 }, // 13: Green Start
  { row: 2, col: 8 }, // 14
  { row: 3, col: 8 }, // 15
  { row: 4, col: 8 }, // 16
  { row: 5, col: 8 }, // 17

  // Turning RIGHT along Green Yard bottom (18..23)
  { row: 6, col: 9 }, // 18
  { row: 6, col: 10 }, // 19
  { row: 6, col: 11 }, // 20
  { row: 6, col: 12 }, // 21: Safe Star 2
  { row: 6, col: 13 }, // 22
  { row: 6, col: 14 }, // 23

  // Across Right Edge (24..25)
  { row: 7, col: 14 }, // 24
  { row: 8, col: 14 }, // 25

  // Turning LEFT along Yellow Yard top (26..30)
  { row: 8, col: 13 }, // 26: Yellow Start
  { row: 8, col: 12 }, // 27
  { row: 8, col: 11 }, // 28
  { row: 8, col: 10 }, // 29
  { row: 8, col: 9 }, // 30

  // Turning DOWN along Yellow Yard left (31..36)
  { row: 9, col: 8 }, // 31
  { row: 10, col: 8 }, // 32
  { row: 11, col: 8 }, // 33
  { row: 12, col: 8 }, // 34: Safe Star 3
  { row: 13, col: 8 }, // 35
  { row: 14, col: 8 }, // 36

  // Across Bottom Edge (37..38)
  { row: 14, col: 7 }, // 37
  { row: 14, col: 6 }, // 38

  // Turning UP along Blue Yard right (39..43)
  { row: 13, col: 6 }, // 39: Blue Start
  { row: 12, col: 6 }, // 40
  { row: 11, col: 6 }, // 41
  { row: 10, col: 6 }, // 42
  { row: 9, col: 6 }, // 43

  // Turning LEFT along Blue Yard top (44..49)
  { row: 8, col: 5 }, // 44
  { row: 8, col: 4 }, // 45
  { row: 8, col: 3 }, // 46
  { row: 8, col: 2 }, // 47: Safe Star 4
  { row: 8, col: 1 }, // 48
  { row: 8, col: 0 }, // 49

  // Across Left Edge (50..51)
  { row: 7, col: 0 }, // 50
  { row: 6, col: 0 }, // 51
];

// 8 Safe Cells on the 15x15 Board
export const SAFE_CELLS = [
  // 4 Start Cells
  { row: 6, col: 1, color: "#E53935", label: "red-start" },
  { row: 1, col: 8, color: "#43A047", label: "green-start" },
  { row: 8, col: 13, color: "#FDD835", label: "yellow-start" },
  { row: 13, col: 6, color: "#1E88E5", label: "blue-start" },

  // 4 Star Safe Cells
  { row: 2, col: 6, color: "#43A047", label: "star-green-track" },
  { row: 6, col: 12, color: "#FDD835", label: "star-yellow-track" },
  { row: 12, col: 8, color: "#1E88E5", label: "star-blue-track" },
  { row: 8, col: 2, color: "#E53935", label: "star-red-track" },
];

export const TOTAL_STEPS_TO_HOME = 56; // 0..50 (51 steps on track) + 51..55 (5 steps home stretch) + 56 (center home)

