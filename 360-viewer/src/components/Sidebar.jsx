import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css'; // Import custom CSS

function Sidebar({ currentMode, onSelectMode, onAddHotspot }) {
  return (
    <div className="Sidebar d-flex flex-column gap-3 p-3">
      <h3 className="text-center mb-3">Hotspot Controls</h3>
      <button
        className={`btn btn-dark w-100 ${currentMode === "select" ? "active" : ""}`}
        onClick={onSelectMode} // Ensure this function is passed correctly
        disabled={currentMode === "select"}
      >
        Select Mode
      </button>
      <button
        className={`btn btn-dark w-100 ${currentMode === "addHotspot" ? "active" : ""}`}
        onClick={onAddHotspot} // Ensure this function is passed correctly
        disabled={currentMode === "addHotspot"}
      >
        Add Hotspot Mode
      </button>
    </div>
  );
}

export default Sidebar;