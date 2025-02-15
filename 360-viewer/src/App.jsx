import KrpanoViewer from './components/KrpanoViewer.jsx'; // <-- Correct path
import './App.css';
import Sidebar from './components/Sidebar.jsx'

function App() {
  return (
    <>
      <div className="App">
        <Sidebar /> {/* Corrected component name */}
        <div id="app">
          <KrpanoViewer />
        </div>
      </div>
    </>
  );
}

export default App;