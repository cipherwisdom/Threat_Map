// src/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                THREAT MAP
            </div>
            <div className="navbar-right">
                <Link to="/map" className="navbar-link">MAP</Link>
                {/* <Link to="/dashboard" className="navbar-link">DASHBOARD</Link> */}
                <Link to="/trends" className="navbar-link">TRENDS</Link>
                <Link to="/insights" className="navbar-link">THREAT INSIGHTS</Link>
            </div>
        </nav>
    );
};

export default Navbar;
