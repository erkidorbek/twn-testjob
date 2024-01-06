import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import TwnTable from './components/Table';
import Article from './components/Article';
import Home from './components/Home';
import Header from './components/Header';
import Nav from './components/Nav';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="App">
      <Header setMenuStatus={setIsMenuOpen} menuOpen={isMenuOpen} />

      <Nav isOpen={isMenuOpen} />

      <Router>
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
