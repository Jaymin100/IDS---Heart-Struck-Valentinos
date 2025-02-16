import { useEffect, useState } from 'react';
import HotspotCoordinates from './HotspotCoordinates.jsx';
import RHSSidebar from './RHSSidebar.jsx'; // Import the RHSSidebar component

const HandleMouseClick = ({ krpano, mode, description }) => {
  const [coordinates, setCoordinates] = useState({ ath: null, atv: null });
  const [sceneId, setSceneId] = useState("defaultScene");
  const [hotspots, setHotspots] = useState([]); // State to store hotspots
  const [selectedHotspot, setSelectedHotspot] = useState(null); // State to track the selected hotspot

  // Function to handle description updates
  const handleDescriptionUpdate = (hotspotId, newDescription) => {
    // Update the description in the local state
    setHotspots(prevHotspots =>
      prevHotspots.map(hotspot =>
        hotspot.id === hotspotId ? { ...hotspot, description: newDescription } : hotspot
      )
    );

    // Update the description in the backend
    fetch(`http://localhost:5000/api/hotspots/${hotspotId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: newDescription }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Hotspot description updated:', data);
      })
      .catch(error => console.error('Error updating hotspot description:', error));
  };

  // Function to handle hotspot deletion
  const handleDeleteHotspot = (hotspotId) => {
    // Remove from local state
    setHotspots(prevHotspots => 
      prevHotspots.filter(hotspot => hotspot.id !== hotspotId)
    );

    // Remove from krpano viewer
    if (krpano) {
      krpano.call(`removehotspot(hs_${hotspotId})`);
    }

    // Delete from backend
    fetch(`http://localhost:5000/api/hotspots/${hotspotId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) throw new Error('Delete failed');
      console.log('Hotspot deleted successfully');
    })
    .catch(error => console.error('Error deleting hotspot:', error));
  };

  const handleClick = (e) => {
    console.log('handleClick called'); // Debugging line
    if (krpano && mode === "addHotspot") {
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const krpanoCoords = krpano.screentosphere(mouseX, mouseY);
      const { x: ath, y: atv } = krpanoCoords;
       // Check if a hotspot already exists at these coordinates
    const isDuplicate = hotspots.some(hotspot =>
      Math.abs(hotspot.ath - ath) < 0.1 && Math.abs(hotspot.atv - atv) < 0.1
    );

    if (isDuplicate) {
      console.log('Hotspot already exists at these coordinates');
      return; // Skip creating a new hotspot
    }

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
    } else if (mode === "select") {
      // Handle hotspot selection
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const krpanoCoords = krpano.screentosphere(mouseX, mouseY);
      const { x: ath, y: atv } = krpanoCoords;

      // Find the hotspot that is closest to the clicked coordinates
      const selected = hotspots.find(hotspot => {
        const deltaAth = Math.abs(hotspot.ath - ath);
        const deltaAtv = Math.abs(hotspot.atv - atv);
        return deltaAth < 5 && deltaAtv < 5; // Adjust the threshold as needed
      });

      if (selected) {
        setSelectedHotspot(selected);
      }
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
      <RHSSidebar 
        selectedHotspot={selectedHotspot} 
        onDescriptionUpdate={handleDescriptionUpdate}
        onDeleteHotspot={handleDeleteHotspot} // Pass the delete function
      />
    </>
  );
};

export default HandleMouseClick;