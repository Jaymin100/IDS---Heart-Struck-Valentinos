// Sidebar.js (Corrected)
import React from "react";

function Sidebar({ currentMode, onSelectMode, onAddHotspot }) {
  return (
    <div className="Sidebar">
      <button 
        onClick={onSelectMode} 
        disabled={currentMode === "select"}
      >
        Select Mode
      </button>
      <button 
        onClick={onAddHotspot} 
        disabled={currentMode === "addHotspot"}  // Changed to disabled
      >
        Add Hotspot Mode
      </button>
    </div>
  );
}

export default Sidebar;