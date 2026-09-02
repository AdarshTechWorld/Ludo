import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import background from "../../assets/images/landscape.png";
import logo from "../../assets/images/logo.png";
import { audioManager } from "../../utils/audioManager";

const BOT_NAMES = {
  RED: "Bot Spark 🤖",
  GREEN: "Bot Nova 🤖",
  YELLOW: "Bot Alex 🤖",
  BLUE: "Bot Cyber 🤖",
};

export default function Dashboard() {
  const [showPassPlayModal, setShowPassPlayModal] = useState(false);
  const [showVsComputerModal, setShowVsComputerModal] = useState(false);
  const [showSpinModal, setShowSpinModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(null);

  // Pass & Play states
  const [playerCount, setPlayerCount] = useState(4); // 2, 3, 4
  const [twoPlayerOption, setTwoPlayerOption] = useState("RED_YELLOW"); // 'RED_YELLOW' or 'GREEN_BLUE'
  const [gameType, setGameType] = useState("CLASSIC"); // CLASSIC or RUSH
  const [coins, setCoins] = useState(2500);
  const [diamonds] = useState(45);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDeg, setSpinDeg] = useState(0);
  const [spinPrize, setSpinPrize] = useState(null);

  // Vs Computer states
  const [userBotColor, setUserBotColor] = useState("RED");
  const [botPlayerCount, setBotPlayerCount] = useState(4); // 2, 3, 4

  const [playerNames, setPlayerNames] = useState({
    RED: "Player 1",
    GREEN: "Player 2",
    YELLOW: "Player 3",
    BLUE: "Player 4",
  });

  const navigate = useNavigate();

  const handleOpenOffline = () => {
    audioManager.playButtonClick();
    setShowPassPlayModal(true);
  };

  const handleOpenVsComputer = () => {
    audioManager.playButtonClick();
    setShowVsComputerModal(true);
  };

  const handleNameChange = (colorKey, name) => {
    setPlayerNames((prev) => ({ ...prev, [colorKey]: name }));
  };

  // Start Pass & Play match (all local humans)
  const handleStartPassPlayGame = () => {
    audioManager.playButtonClick();
    setShowPassPlayModal(false);

    let activeColors = [];
    if (playerCount === 2) {
      activeColors = twoPlayerOption === "RED_YELLOW" ? ["RED", "YELLOW"] : ["GREEN", "BLUE"];
    } else if (playerCount === 3) {
      activeColors = ["RED", "GREEN", "YELLOW"];
    } else {
      activeColors = ["RED", "GREEN", "YELLOW", "BLUE"];
    }

    const playersConfig = activeColors.map((color, index) => ({
      id: color,
      name: playerNames[color]?.trim() || `Player ${index + 1}`,
      color: color,
      isBot: false,
      avatar: `https://api.dicebear.com/9.x/bottts/svg?seed=${playerNames[color] || color}`,
    }));

    navigate("/board", { state: { playersConfig, playerCount, gameType } });
  };

  // Start Vs Computer match (Human + AI Bots)
  const handleStartVsComputerGame = () => {
    audioManager.playButtonClick();
    setShowVsComputerModal(false);

    let activeColors = [];
    if (botPlayerCount === 2) {
      // 2 Players: Human vs Opposite Color Bot
      const oppositeMap = {
        RED: "YELLOW",
        YELLOW: "RED",
        GREEN: "BLUE",
        BLUE: "GREEN",
      };
      activeColors = [userBotColor, oppositeMap[userBotColor]];
    } else if (botPlayerCount === 3) {
      const allColors = ["RED", "GREEN", "YELLOW", "BLUE"];
      // Keep human color + next 2 colors
      const remaining = allColors.filter((c) => c !== userBotColor);
      activeColors = [userBotColor, remaining[0], remaining[1]];
    } else {
      activeColors = ["RED", "GREEN", "YELLOW", "BLUE"];
    }

    const playersConfig = activeColors.map((color) => {
      const isHuman = color === userBotColor;
      return {
        id: color,
        name: isHuman ? "You (Player)" : BOT_NAMES[color],
        color: color,
        isBot: !isHuman,
        avatar: isHuman
          ? `https://api.dicebear.com/9.x/bottts/svg?seed=HumanHero`
          : `https://api.dicebear.com/9.x/bottts/svg?seed=${BOT_NAMES[color]}`,
      };
    });

    navigate("/board", { state: { playersConfig, playerCount: botPlayerCount, gameType } });
  };

  // Lucky Spin Wheel
  const handleSpinWheel = () => {
    if (isSpinning) return;
    audioManager.playDiceRoll();
    setIsSpinning(true);
    setSpinPrize(null);

    const randomDeg = 1440 + Math.floor(Math.random() * 360);
    const newTotalDeg = spinDeg + randomDeg;
    setSpinDeg(newTotalDeg);

    setTimeout(() => {
      setIsSpinning(false);
      const prizeAmounts = [200, 500, 1000, 1500, 300, 750];
      const awarded = prizeAmounts[Math.floor(Math.random() * prizeAmounts.length)];
      setSpinPrize(awarded);
      setCoins((c) => c + awarded);
      audioManager.playSafe();
    }, 3200);
  };

  return (
    <div
      className="lk-dashboard"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 30%, rgba(20, 32, 70, 0.78) 0%, rgba(6, 10, 24, 0.96) 100%), url(${background})`,
      }}
    >
      {/* ====================================================
          1. TOP BAR (Profile, Logo, Coins, Gems, Settings)
         ==================================================== */}
      <header className="lk-top-bar">
        {/* Left: Player Profile */}
        <div className="lk-profile-card">
          <div className="lk-avatar-wrapper">
            <img
              src="https://api.dicebear.com/9.x/bottts/svg?seed=KingPlayer"
              alt="Player Avatar"
              className="lk-avatar-img"
            />
            <span className="lk-level-badge">⭐ 8</span>
          </div>
          <div className="lk-profile-info">
            <span className="lk-profile-name">GUEST_7894</span>
            <div className="lk-xp-bar-bg">
              <div className="lk-xp-bar-fill" style={{ width: "65%" }} />
            </div>
            <span className="lk-vip-tag">👑 VIP CLUB</span>
          </div>
        </div>

        {/* Center: Crown Ludo King Logo */}
        <div className="lk-center-logo">
          <img src={logo} alt="Ludo King" className="lk-logo-image" />
          <h1 className="lk-logo-text">LUDO KING</h1>
        </div>

        {/* Right: Economy & Settings */}
        <div className="lk-economy-panel">
          <div className="lk-currency-badge coin-badge">
            <span className="curr-icon">🪙</span>
            <span className="curr-value">{coins.toLocaleString()}</span>
            <button className="btn-add-currency" onClick={() => setShowSpinModal(true)}>+</button>
          </div>

          <div className="lk-currency-badge diamond-badge">
            <span className="curr-icon">💎</span>
            <span className="curr-value">{diamonds}</span>
            <button className="btn-add-currency" onClick={() => setShowComingSoonModal("Store")}>+</button>
          </div>

          <button
            className="btn-top-icon settings-btn"
            onClick={() => {
              audioManager.playButtonClick();
              setShowSettingsModal(true);
            }}
            title="Settings & Audio"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* ====================================================
          2. MAIN GAME MODES GRID (Original 4-Box Layout)
         ==================================================== */}
      <main className="lk-main-content">
        <div className="lk-modes-grid">
          {/* 1. PLAY ONLINE */}
          <div
            className="lk-mode-card online-mode"
            onClick={() => setShowComingSoonModal("Play Online Multiplayer")}
          >
            <div className="card-top-ribbon">WORLDWIDE</div>
            <div className="card-visual-icon">🌐</div>
            <div className="card-info">
              <h2>PLAY ONLINE</h2>
              <p>Match with Global Players</p>
            </div>
            <div className="card-badge-footer">ONLINE 2-4P</div>
          </div>

          {/* 2. PLAY WITH FRIENDS */}
          <div
            className="lk-mode-card friends-mode"
            onClick={() => setShowComingSoonModal("Play With Friends (Private Room)")}
          >
            <div className="card-top-ribbon">PRIVATE ROOM</div>
            <div className="card-visual-icon">👥</div>
            <div className="card-info">
              <h2>PLAY WITH FRIENDS</h2>
              <p>Create & Join Room</p>
            </div>
            <div className="card-badge-footer">CUSTOM CODE</div>
          </div>

          {/* 3. VS COMPUTER (ACTIVE SMART AI) */}
          <div
            className="lk-mode-card computer-mode active-highlight-gold"
            onClick={handleOpenVsComputer}
          >
            <div className="card-top-ribbon popular">SMART AI BOT</div>
            <div className="card-visual-icon">🤖</div>
            <div className="card-info">
              <h2>VS COMPUTER</h2>
              <p>Play with Smart Bots (Offline)</p>
            </div>
            <div className="card-badge-footer featured">PLAY VS AI ⚡</div>
          </div>

          {/* 4. PASS N PLAY (OFFLINE MULTIPLAYER) */}
          <div
            className="lk-mode-card passplay-mode active-highlight"
            onClick={handleOpenOffline}
          >
            <div className="card-top-ribbon popular">⭐ MOST POPULAR</div>
            <div className="card-visual-icon animated-dice-pawn">🎲</div>
            <div className="card-info">
              <h2>PASS N PLAY</h2>
              <p>Play 2, 3, or 4 Players Offline</p>
            </div>
            <div className="card-badge-footer featured">TAP TO PLAY! 🎮</div>
          </div>
        </div>

        {/* Bonus Event Banner */}
        <div className="lk-event-banner" onClick={() => setShowSpinModal(true)}>
          <span className="event-icon">🎁</span>
          <div className="event-text">
            <strong>FREE LUCKY WHEEL AVAILABLE!</strong>
            <span>Spin now to claim up to 1,500 bonus coins!</span>
          </div>
          <button className="btn-event-spin">SPIN NOW</button>
        </div>
      </main>

      {/* ====================================================
          3. BOTTOM NAVIGATION BAR
         ==================================================== */}
      <footer className="lk-bottom-bar">
        <button className="lk-nav-item" onClick={() => setShowSpinModal(true)}>
          <span className="nav-icon">🎡</span>
          <span className="nav-label">Lucky Spin</span>
        </button>

        <button className="lk-nav-item" onClick={() => setShowComingSoonModal("Leaderboard")}>
          <span className="nav-icon">🏆</span>
          <span className="nav-label">Rankings</span>
        </button>

        <button className="lk-nav-item center-shop" onClick={() => setShowComingSoonModal("Store")}>
          <span className="nav-icon">🛒</span>
          <span className="nav-label">Store</span>
        </button>

        <button className="lk-nav-item" onClick={() => setShowComingSoonModal("Missions")}>
          <span className="nav-icon">📜</span>
          <span className="nav-label">Missions</span>
        </button>

        <button className="lk-nav-item" onClick={() => setShowComingSoonModal("Dice & Themes")}>
          <span className="nav-icon">🎨</span>
          <span className="nav-label">Themes</span>
        </button>
      </footer>

      {/* ====================================================
          4. PASS N PLAY SETUP MODAL
         ==================================================== */}
      {showPassPlayModal && (
        <div className="lk-modal-overlay">
          <div className="lk-royal-modal">
            {/* Modal Header */}
            <div className="lk-modal-header">
              <span className="header-crown">👑</span>
              <h2>PASS N PLAY</h2>
              <button
                className="btn-modal-close"
                onClick={() => setShowPassPlayModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="lk-modal-content">
              {/* Game Mode Selector: Classic vs Rush */}
              <div className="modal-sub-section">
                <span className="sub-title">SELECT GAME TYPE</span>
                <div className="game-type-toggle">
                  <button
                    className={`btn-type-pill ${gameType === "CLASSIC" ? "active" : ""}`}
                    onClick={() => {
                      audioManager.playButtonClick();
                      setGameType("CLASSIC");
                    }}
                  >
                    🎲 CLASSIC LUDO
                  </button>
                  <button
                    className={`btn-type-pill ${gameType === "RUSH" ? "active" : ""}`}
                    onClick={() => {
                      audioManager.playButtonClick();
                      setGameType("RUSH");
                    }}
                  >
                    ⚡ QUICK LUDO
                  </button>
                </div>
              </div>

              {/* Player Count Selection */}
              <div className="modal-sub-section">
                <span className="sub-title">CHOOSE NUMBER OF PLAYERS</span>
                <div className="player-tabs-row">
                  {[2, 3, 4].map((count) => (
                    <button
                      key={count}
                      className={`btn-count-card ${playerCount === count ? "selected" : ""}`}
                      onClick={() => {
                        audioManager.playButtonClick();
                        setPlayerCount(count);
                      }}
                    >
                      <div className="tab-icon">
                        {count === 2 ? "👥" : count === 3 ? "👪" : "👨‍👩‍👧‍👦"}
                      </div>
                      <span className="tab-text">{count} PLAYERS</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2-Player Alignment Options */}
              {playerCount === 2 && (
                <div className="modal-sub-section">
                  <span className="sub-title">2-PLAYER CORNER ALIGNMENT</span>
                  <div className="two-player-selection">
                    <button
                      className={`btn-side-choice ${twoPlayerOption === "RED_YELLOW" ? "active" : ""}`}
                      onClick={() => {
                        audioManager.playButtonClick();
                        setTwoPlayerOption("RED_YELLOW");
                      }}
                    >
                      <div className="choice-tokens">
                        <span className="dot red" />
                        <span className="vs-text">VS</span>
                        <span className="dot yellow" />
                      </div>
                      <span className="choice-name">Red vs Yellow (Opposite)</span>
                    </button>

                    <button
                      className={`btn-side-choice ${twoPlayerOption === "GREEN_BLUE" ? "active" : ""}`}
                      onClick={() => {
                        audioManager.playButtonClick();
                        setTwoPlayerOption("GREEN_BLUE");
                      }}
                    >
                      <div className="choice-tokens">
                        <span className="dot green" />
                        <span className="vs-text">VS</span>
                        <span className="dot blue" />
                      </div>
                      <span className="choice-name">Green vs Blue (Opposite)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Player Name Editors */}
              <div className="modal-sub-section">
                <span className="sub-title">CUSTOMIZE PLAYER NAMES</span>
                <div className="player-names-container">
                  {(playerCount === 2
                    ? twoPlayerOption === "RED_YELLOW"
                      ? ["RED", "YELLOW"]
                      : ["GREEN", "BLUE"]
                    : playerCount === 3
                    ? ["RED", "GREEN", "YELLOW"]
                    : ["RED", "GREEN", "YELLOW", "BLUE"]
                  ).map((colorKey) => (
                    <div key={colorKey} className="name-row-card">
                      <span className={`pawn-badge ${colorKey.toLowerCase()}`} />
                      <input
                        type="text"
                        value={playerNames[colorKey]}
                        maxLength={12}
                        onChange={(e) => handleNameChange(colorKey, e.target.value)}
                        placeholder={`Name for ${colorKey}`}
                        className="lk-name-field"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Big Green Play Button */}
              <button className="btn-big-play" onClick={handleStartPassPlayGame}>
                <span className="play-icon">▶</span> START MATCH
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          5. VS COMPUTER SETUP MODAL (NEW AI BOTS)
         ==================================================== */}
      {showVsComputerModal && (
        <div className="lk-modal-overlay">
          <div className="lk-royal-modal bot-modal">
            {/* Modal Header */}
            <div className="lk-modal-header">
              <span className="header-crown">🤖</span>
              <h2>VS COMPUTER</h2>
              <button
                className="btn-modal-close"
                onClick={() => setShowVsComputerModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="lk-modal-content">
              {/* Choose Your Color */}
              <div className="modal-sub-section">
                <span className="sub-title">CHOOSE YOUR TOKEN COLOR</span>
                <div className="bot-color-picker">
                  {[
                    { key: "RED", name: "Red", color: "#e53935" },
                    { key: "GREEN", name: "Green", color: "#43a047" },
                    { key: "YELLOW", name: "Yellow", color: "#fdd835" },
                    { key: "BLUE", name: "Blue", color: "#1e88e5" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      className={`btn-color-choice ${userBotColor === item.key ? "selected" : ""}`}
                      style={{
                        backgroundColor: item.color,
                        boxShadow: userBotColor === item.key ? `0 0 15px ${item.color}, 0 4px 10px rgba(0,0,0,0.5)` : "none",
                      }}
                      onClick={() => {
                        audioManager.playButtonClick();
                        setUserBotColor(item.key);
                      }}
                    >
                      {userBotColor === item.key && <span className="check-mark">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Players */}
              <div className="modal-sub-section">
                <span className="sub-title">NUMBER OF PLAYERS (YOU + BOTS)</span>
                <div className="player-tabs-row">
                  {[
                    { count: 2, label: "1 VS 1 BOT" },
                    { count: 3, label: "1 VS 2 BOTS" },
                    { count: 4, label: "1 VS 3 BOTS" },
                  ].map(({ count, label }) => (
                    <button
                      key={count}
                      className={`btn-count-card ${botPlayerCount === count ? "selected" : ""}`}
                      onClick={() => {
                        audioManager.playButtonClick();
                        setBotPlayerCount(count);
                      }}
                    >
                      <div className="tab-icon">
                        {count === 2 ? "🤖" : count === 3 ? "🤖🤖" : "🤖🤖🤖"}
                      </div>
                      <span className="tab-text">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Game Type Selection */}
              <div className="modal-sub-section">
                <span className="sub-title">MATCH MODE</span>
                <div className="game-type-toggle">
                  <button
                    className={`btn-type-pill ${gameType === "CLASSIC" ? "active" : ""}`}
                    onClick={() => {
                      audioManager.playButtonClick();
                      setGameType("CLASSIC");
                    }}
                  >
                    🎲 CLASSIC
                  </button>
                  <button
                    className={`btn-type-pill ${gameType === "RUSH" ? "active" : ""}`}
                    onClick={() => {
                      audioManager.playButtonClick();
                      setGameType("RUSH");
                    }}
                  >
                    ⚡ QUICK
                  </button>
                </div>
              </div>

              {/* Start Game Button */}
              <button className="btn-big-play bot-play" onClick={handleStartVsComputerGame}>
                <span className="play-icon">🤖</span> PLAY VS COMPUTER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          6. LUCKY SPIN WHEEL MODAL
         ==================================================== */}
      {showSpinModal && (
        <div className="lk-modal-overlay" onClick={() => !isSpinning && setShowSpinModal(false)}>
          <div className="lk-spin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="spin-header">
              <h2>🎡 DAILY LUCKY WHEEL</h2>
              {!isSpinning && (
                <button className="btn-modal-close" onClick={() => setShowSpinModal(false)}>
                  ✕
                </button>
              )}
            </div>

            <div className="wheel-wrapper">
              <div
                className="spin-wheel-circle"
                style={{
                  transform: `rotate(${spinDeg}deg)`,
                  transition: isSpinning ? "transform 3s cubic-bezier(0.15, 0.9, 0.25, 1)" : "none",
                }}
              >
                <div className="slice slice-1">🪙 200</div>
                <div className="slice slice-2">🪙 500</div>
                <div className="slice slice-3">💎 10</div>
                <div className="slice slice-4">🪙 1,000</div>
                <div className="slice slice-5">🪙 300</div>
                <div className="slice slice-6">🪙 1,500</div>
              </div>
              <div className="wheel-pointer">🔻</div>
            </div>

            {spinPrize && (
              <div className="spin-prize-banner">
                🎉 YOU WON 🪙 {spinPrize} COINS!
              </div>
            )}

            <button
              className={`btn-spin-action ${isSpinning ? "spinning" : ""}`}
              onClick={handleSpinWheel}
              disabled={isSpinning}
            >
              {isSpinning ? "SPINNING..." : "🎲 SPIN FOR FREE!"}
            </button>
          </div>
        </div>
      )}

      {/* ====================================================
          7. SETTINGS MODAL
         ==================================================== */}
      {showSettingsModal && (
        <div className="lk-modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="lk-settings-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="settings-head">
              <h2>⚙️ GAME SETTINGS</h2>
              <button className="btn-modal-close" onClick={() => setShowSettingsModal(false)}>
                ✕
              </button>
            </div>

            <div className="settings-item">
              <span>Sound Effects (SFX)</span>
              <button
                className={`btn-sound-toggle ${audioManager.isMuted ? "muted" : "active"}`}
                onClick={() => {
                  audioManager.toggleMute();
                  audioManager.playButtonClick();
                  setShowSettingsModal(false);
                }}
              >
                {audioManager.isMuted ? "🔇 MUTED" : "🔊 SOUND ON"}
              </button>
            </div>

            <div className="settings-item">
              <span>Game Version</span>
              <span className="version-label">v2.4.0 (Pro Offline Edition)</span>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          8. COMING SOON NOTICE MODAL
         ==================================================== */}
      {showComingSoonModal && (
        <div className="lk-modal-overlay" onClick={() => setShowComingSoonModal(null)}>
          <div className="lk-alert-modal" onClick={(e) => e.stopPropagation()}>
            <h3>🌟 {showComingSoonModal}</h3>
            <p>This mode is under development and will be available in the next online multiplayer release!</p>
            <button
              className="btn-alert-ok"
              onClick={() => setShowComingSoonModal(null)}
            >
              GOT IT!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}