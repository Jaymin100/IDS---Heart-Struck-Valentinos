import React, { useEffect } from 'react';

const HotspotCoordinates = ({ ath, atv, sceneId, description }) => {
  useEffect(() => {
    if (ath !== null && atv !== null) {
      console.log('Received coordinates:', { ath, atv, sceneId, description });  // Log sceneId and description

      // Create an ID for the hotspot
      const id = Date.now(); // Unique ID based on timestamp

      // Send the coordinates and other data to the server using fetch
      fetch('http://localhost:5000/coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ath, atv, scene_id: sceneId, description }), // Log this data before sending
      })
        .then(response => response.json())
        .then(data => console.log('Server response:', data))
        .catch(error => console.error('Error sending data:', error));
    }
  }, [ath, atv, sceneId, description]);

  return null;
};

export default HotspotCoordinates;
