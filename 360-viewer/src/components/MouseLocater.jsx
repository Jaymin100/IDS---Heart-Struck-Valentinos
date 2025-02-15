import { useEffect } from 'react';

const HandleMouseClick = ({ krpano }) => {
  const handleClick = (e) => {
    if (krpano) {
      // Get mouse coordinates relative to the krpano viewer
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Convert screen coordinates to spherical coordinates
      const krpanoCoords = krpano.screentosphere(mouseX, mouseY);
      const { x: ath, y: atv } = krpanoCoords;

      console.log('Sphere coordinates:', { ath, atv });

      // Add a hotspot at the clicked location
      krpano.call(`
        addhotspot(hs_${Date.now()});
        set(hotspot[hs_${Date.now()}].ath, ${ath});
        set(hotspot[hs_${Date.now()}].atv, ${atv});
        set(hotspot[hs_${Date.now()}].url, %VIEWER%/hotspots/hotspot.png);
        set(hotspot[hs_${Date.now()}].scale, 0.1);
        set(hotspot[hs_${Date.now()}].onclick, trace('Hotspot clicked!'));
      `);
    }
  };

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
  }, [krpano]);

  return null;
};

export default HandleMouseClick;