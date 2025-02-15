const HandleMouseClick = (e) => {
    const krpano = window.krpano;  // Access krpano from the global window object
    if (krpano) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
  
      const view = krpano.getview(mouseX, mouseY);
      const ath = view.ath;
      const atv = view.atv;
      const kpranoCords = (krpano.screentosphere(ath,atv));
      console.log(`Mouse click at ath: ${ath}, atv: ${atv}`);
      console.log(`Krpano Cords: ${kpranoCords}`);
      
    } else {
      console.error('krpano is not loaded.');
    }
  };
  export default HandleMouseClick;