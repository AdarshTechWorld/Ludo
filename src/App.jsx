import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard/dashboard"; 
import Main_Board from "./components/Board/main_board";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Menu Path */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Active Playing Board Path */}
        <Route path="/board" element={<Main_Board />} />
      </Routes>
    </Router>
  );
}