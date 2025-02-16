import { useEffect, useState } from 'react';
import HotspotCoordinates from './HotspotCoordinates.jsx';

const HandleMouseClick = ({ krpano, mode, description }) => {
  const [coordinates, setCoordinates] = useState({ ath: null, atv: null });
  const [sceneId, setSceneId] = useState("defaultScene");
  const [hotspots, setHotspots] = useState([]); // State to store hotspots

  const handleClick = (e) => {
    if (krpano && mode === "addHotspot") { // Only proceed if mode is "addHotspot"
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const krpanoCoords = krpano.screentosphere(mouseX, mouseY);
      const { x: ath, y: atv } = krpanoCoords;

      console.log('Sphere coordinates:', { ath, atv });

      setCoordinates({ ath, atv });

      const newHotspot = {
        ath,
        atv,
        scene_id: sceneId,
        description,
      };

      // Save the new hotspot to the database
      fetch('http://localhost:5000/coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Date.now(),
          ath,
          atv,
          scene_id: sceneId,
          description,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Hotspot saved:', data);

          // Immediately add the new hotspot to the krpano scene
          const hotspotId = data.id;
          krpano.call(`
            addhotspot(hs_${hotspotId});
            set(hotspot[hs_${hotspotId}].ath, ${ath});
            set(hotspot[hs_${hotspotId}].atv, ${atv});
            set(hotspot[hs_${hotspotId}].url, %VIEWER%/hotspots/hotspot.png);
            set(hotspot[hs_${hotspotId}].scale, 0.1);
            set(hotspot[hs_${hotspotId}].onclick, trace('Hotspot clicked! Description: ${description}'));
          `);

          // Update the hotspots state
          setHotspots(prevHotspots => [
            ...prevHotspots,
            { id: hotspotId, ath, atv, description }
          ]);
        })
        .catch(error => console.error('Error saving hotspot:', error));
    }
  };

  useEffect(() => {
    // Fetch existing hotspots from the server when the component mounts
    fetch(`http://localhost:5000/api/hotspots?scene_id=${sceneId}`)
      .then(response => response.json())
      .then(data => {
        setHotspots(data); // Set the hotspots from the server
        // Add the hotspots to krpano
        data.forEach(hotspot => {
          krpano.call(`
            addhotspot(hs_${hotspot.id});
            set(hotspot[hs_${hotspot.id}].ath, ${hotspot.ath});
            set(hotspot[hs_${hotspot.id}].atv, ${hotspot.atv});
            set(hotspot[hs_${hotspot.id}].url, %VIEWER%/hotspots/hotspot.png);
            set(hotspot[hs_${hotspot.id}].scale, 0.1);
            set(hotspot[hs_${hotspot.id}].onclick, trace('Hotspot clicked!'););
          `);
        });
      })
      .catch(error => console.error('Error fetching hotspots:', error));
  }, [krpano, sceneId]);

  useEffect(() => {
    const container = document.getElementById('krpano-target');
    if (container && krpano) {
      container.addEventListener('click', handleClick);
    }
    return () => {
      if (container) {
        container.removeEventListener('click', handleClick);
      }
    };
  }, [krpano, mode, handleClick]);

  return (
    <>
      {mode === "addHotspot" && (
        <HotspotCoordinates
          ath={coordinates.ath}
          atv={coordinates.atv}
          sceneId={sceneId}
          description={description}
        />
      )}
    </>
  );
};

export default HandleMouseClick;
