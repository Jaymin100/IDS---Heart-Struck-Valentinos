import { useEffect, useState } from 'react';
import loadKrpano from '../loadKrpano';
import HandleMouseClick from './MouseLocater';

const KrpanoViewer = () => {
  const [krpano, setKrpano] = useState(null);

  useEffect(() => {
    loadKrpano()
      .then(setKrpano)
      .catch(console.error);
  }, []);

  return (
    <div>
      <div id="krpano-target" />
      {krpano && <HandleMouseClick krpano={krpano} />}
    </div>
  );
};

export default KrpanoViewer;