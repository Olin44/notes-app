// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import NoteList from './components/NotesList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Notes Application</h1>
        <NoteList />
      </header>
    </div>
  );
}

export default App;
