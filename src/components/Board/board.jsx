import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Main_Board.css";

export default function Board() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const playerCount = location.state?.players || 4;

  const cells = [];
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      cells.push({ row, col });
    }
  }

  // Refactored to match standard Ludo placement shown in board_layout.png
  const getCellStyles = (row, col) => {
    // 4 Corner Quadrants
    if (row < 6 && col < 6) return { backgroundColor: '#e74c3c', border: 'none' }; // Red Top-Left
    if (row < 6 && col > 8) return { backgroundColor: '#2ecc71', border: 'none' }; // Green Top-Right
    if (row > 8 && col < 6) return { backgroundColor: '#3498db', border: 'none' }; // Blue Bottom-Left
    if (row > 8 && col > 8) return { backgroundColor: '#f1c40f', border: 'none' }; // Yellow Bottom-Right
    
    // Center Safe-Zone Home Triangle Area
    if (row >= 6 && row <= 8 && col >= 6 && col <= 8) return { backgroundColor: '#ffffff' };
    
    // Home Paths
    if (row === 7 && col > 0 && col < 6) return { backgroundColor: '#e74c3c' };   // Red Home Path
    if (col === 7 && row > 0 && row < 6) return { backgroundColor: '#2ecc71' };   // Green Home Path
    if (col === 7 && row > 8 && row < 14) return { backgroundColor: '#3498db' };  // Blue Home Path
    if (row === 7 && col > 8 && col < 14) return { backgroundColor: '#f1c40f' };  // Yellow Home Path
    
    // Starting Safe Cells (Arrows)
    if (row === 6 && col === 1) return { backgroundColor: '#e74c3c' };
    if (row === 1 && col === 8) return { backgroundColor: '#2ecc71' };
    if (row === 13 && col === 6) return { backgroundColor: '#3498db' };
    if (row === 8 && col === 13) return { backgroundColor: '#f1c40f' };
    
    return { backgroundColor: '#ffffff' };
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {/* UI controls sit safely above and outside the grid system wrapper */}
      <div className="d-flex justify-content-between align-items-center mb-3" style={{ width: '100%', maxWidth: '550px' }}>
        <button 
          className="btn btn-danger"
          onClick={() => navigate("/")}
        >
          ↩ Exit Game
        </button>
        <h3 className="text-white m-0">{playerCount} Player Match Running</h3>
      </div>
      
      <div className="board-wrapper">
        {cells.map(({ row, col }, index) => (
          <div 
            key={index} 
            style={{
              border: '1px solid #bdc3c7',
              display: 'flex',
              alignItems: 'center',
              justifycontent: 'center',
              position: 'relative',
              ...getCellStyles(row, col)
            }}
          />
        ))}
      </div>
    </div>
  );
}