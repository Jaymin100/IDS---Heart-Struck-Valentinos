import React, { useEffect } from 'react';
import loadKrpano from './loadKrpano';
import HandleMouseClick from "./components/MouseLocater.jsx"
import './App.css';

function App() {
  useEffect(() => {
    loadKrpano();
  }, []);

  const handleClick = (event) => {
    console.log('clicked', event)
  }

  return (
    <>

    <HandleMouseClick></HandleMouseClick>
    <div id="app">
      <div id="krpano-target" onClick={handleClick}></div>
    </div>

    
    </>
  );
}


export default App;
