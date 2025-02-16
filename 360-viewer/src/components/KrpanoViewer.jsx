import { useEffect, useState } from 'react';
import loadKrpano from '../loadKrpano';
import HandleMouseClick from './MouseLocater';
import Sidebar from './Sidebar'; // Import the Sidebar

const KrpanoViewer = () => {
  const [krpano, setKrpano] = useState(null);
  const [currentMode, setCurrentMode] = useState("select"); // Set initial mode to "select"

  const handleSelectMode = () => setCurrentMode("select");
  const handleAddHotspotMode = () => setCurrentMode("addHotspot");

  useEffect(() => {
    loadKrpano()
      .then(setKrpano)
      .catch(console.error);
  }, []);

  return (
    <div>
      <Sidebar 
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        onAddHotspot={handleAddHotspotMode}
      />
      <div id="krpano-target" />
      {krpano && <HandleMouseClick krpano={krpano} mode={currentMode} />}
    </div>
  );
};

export default KrpanoViewer;