import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import TwnTable from './components/Table';
import Article from './components/Article';
import Home from './components/Home';
import Header from './components/Header';
import Nav from './components/Nav';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="App">
      <Header setMenuStatus={setIsMenuOpen} menuOpen={isMenuOpen} />

      <Router>
        <Nav setMenuStatus={setIsMenuOpen} isOpen={isMenuOpen} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article" element={<Article />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/table" element={<TwnTable />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
