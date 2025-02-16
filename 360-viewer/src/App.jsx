import KrpanoViewer from './components/KrpanoViewer.jsx'; // <-- Correct path
import './App.css';
import Sidebar from './components/Sidebar.jsx'
import RHSSidebar from './components/RHSSidebar.jsx';

function App() {
  return (
    <>
      <div className="App">

        <RHSSidebar /> 
        <div id="app">
          <KrpanoViewer />
        </div>
      </div>
    </>
  );
}

export default App;