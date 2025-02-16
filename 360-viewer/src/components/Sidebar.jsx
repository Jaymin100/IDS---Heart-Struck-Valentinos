import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Sidebar({ currentMode, onSelectMode, onAddHotspot, setDescription }) {
  return (
    <div className="Sidebar d-flex flex-column gap-2 p-3">
      <button
        className={`btn btn-dark ${currentMode === "select" ? "active" : ""}`}
        onClick={onSelectMode}
        disabled={currentMode === "select"}
      >
        Select Mode
      </button>
      <button
        className={`btn btn-dark ${currentMode === "addHotspot" ? "active" : ""}`}
        onClick={onAddHotspot}
        disabled={currentMode === "addHotspot"}
      >
        Add Hotspot Mode
      </button>

      {/* Input Text Field - Disabled in Select Mode */}
      <input
        type="text"
        placeholder="Enter description for your POI"
        className="form-control mt-3"
        disabled={currentMode === "select"} // Disable when mode is "select"
        onChange={(e) => setDescription(e.target.value)} // Update description state
      />
    </div>
  );
}

export default Sidebar;
