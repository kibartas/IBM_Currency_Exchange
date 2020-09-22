import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Currency exchange</h1>
      </header>
      <div className="textFields">
        <input min="0" type="number" step="0.01" placeholder="From"/>
        <select/>
        <input min="0" type="number" step="0.01" placeholder="To"/>
        <select/>
      </div>
    </div>
  );
}

export default App;
