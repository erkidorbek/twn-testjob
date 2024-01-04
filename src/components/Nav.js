import React from "react";
import logo from '../assets/logo.svg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faTable } from '@fortawesome/free-solid-svg-icons'

function Nav({ isOpen }) {
    return (
        <nav className={isOpen ? "open" : ""}>
            <a href="/"><img src={logo} alt="site logo" title="site logo" className="logo" /></a>
            <ul>
                <li><a href="/article">Artikkel <FontAwesomeIcon icon={faFile} /></a></li>
                <li><a href="/table">Tabel <FontAwesomeIcon icon={faTable} /></a></li>
            </ul>
        </nav>
    )
}

export default Nav;
