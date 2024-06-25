import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar" style={{ backgroundColor: 'black', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>Threat Map</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/map" style={{ cursor: 'pointer', marginRight: '20px', color: 'white', textDecoration: 'none' }}>MAP</Link>
                <Link to="/dashboard" style={{ cursor: 'pointer', marginRight: '20px', color: 'white', textDecoration: 'none' }}>DASHBOARD</Link>
                <Link to="/trends" style={{ cursor: 'pointer', marginRight: '20px', color: 'white', textDecoration: 'none' }}>TRENDS</Link>
                <Link to="/insights" style={{ cursor: 'pointer', marginRight: '20px', color: 'white', textDecoration: 'none' }}>THREAT INSIGHTS</Link>
            </div>
        </nav>
    );
};

export default Navbar;
