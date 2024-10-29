import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NoteList from './components/NoteList';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NoteList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
