import React, { useEffect } from 'react';

const HotspotCoordinates = ({ ath, atv, sceneId, description }) => {
  useEffect(() => {
    if (ath !== null && atv !== null) {
      console.log('Received coordinates:', { ath, atv, sceneId, description });  // Log sceneId and description


    }
  }, [ath, atv, sceneId, description]);

  return null;
};

export default HotspotCoordinates;
