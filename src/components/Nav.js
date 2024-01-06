import React from 'react';
import logo from '../assets/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faTable } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const Nav = ({ isOpen }) => {
  return (
    <nav className={isOpen ? 'open' : ''}>
      <a href="/">
        <img src={logo} alt="site logo" title="site logo" className="logo" />
      </a>
      <ul>
        <li>
          <NavLink to="/article">
            Artikkel <FontAwesomeIcon icon={faFile} />
          </NavLink>
        </li>
        <li>
          <NavLink to="/table">
            Tabel <FontAwesomeIcon icon={faTable} />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
