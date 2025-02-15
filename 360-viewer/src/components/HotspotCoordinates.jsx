import React, { useEffect } from 'react';

const HotspotCoordinates = ({ ath, atv }) => {
  useEffect(() => {
    if (ath !== null && atv !== null) {
      console.log('Received coordinates:', { ath, atv });

      // Send the coordinates to the server using fetch
      fetch('http://localhost:5000/coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ath, atv }), // Send the coordinates in the body
      })
        .then(response => response.json())
        .then(data => console.log('Server response:', data))
        .catch(error => console.error('Error sending data:', error));
    }
  }, [ath, atv]);

  return null; // No UI needed
};

export default HotspotCoordinates;
