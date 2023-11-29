import { useRef } from 'react';
import PaxosSystem from './components/PaxosSystem';
import './App.css';

function App() {
  const actionHistory = useRef([]);
  const actionPosition = useRef(-1);

  return (
    <div className="App">
      <header className="App-header">Paxos Visualizer</header>
      <PaxosSystem actionHistory={actionHistory} actionPosition={actionPosition} />
    </div>
  );
}

export default App;
