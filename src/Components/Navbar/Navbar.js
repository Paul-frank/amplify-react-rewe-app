import React, { useState } from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';
  
  const Navbar = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => setIsNavOpen(!isNavOpen);
  
    return (
      <div className="navbar-container">
        <div className="navbar-header">
          <div className="menu-icon" onClick={toggleNav}>
            <i className="fas fa-bars"></i>
          </div>
          <div className="app-name">NutrieQuest</div>
        </div>
        <nav className={isNavOpen ? "navbar open" : "navbar"}>
          <ul className="nav-menu">
            <div className="nav-item">
              <NavLink to="/" className="nav-links nav-button" onClick={() => setIsNavOpen(false)}>
                Home
              </NavLink>
            </div>
            <div className="nav-item">
              <NavLink to="/statistics" className="nav-links nav-button" onClick={() => setIsNavOpen(false)}>
                Statistics
              </NavLink>
            </div>
          </ul>
        </nav>
      </div>
    );
  }
  
  export default Navbar;
  
