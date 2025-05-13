import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import History from './pages/History';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <div className="navbar">
          <Link to="/">Inicio</Link>
          <Link to="/history">Historial</Link>
        </div>

        {/* Header */}
        <header className="header">
          <h1>Cat Facts & GIFs</h1>
        </header>

        {/* Contenido */}
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;