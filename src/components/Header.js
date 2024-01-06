import React from 'react';
import logo from '../assets/logo.svg';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = ({ setMenuStatus, menuOpen }) => {
  return (
    <div className="header">
      <button type="button" onClick={() => setMenuStatus((prev) => !prev)}>
        {menuOpen ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
      </button>
      <a href="/">
        <img src={logo} alt="site logo" title="site logo" className="logo" />
      </a>
    </div>
  );
};

export default Header;
