import React from 'react';
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon">🏥</span>
          <span className="logo-text">MedCare <span className="logo-accent">Plus</span></span>
        </div>
        <nav className="navbar-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/doctors" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Our Doctors
          </NavLink>
          <NavLink 
            to="/booking" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Book Appointment
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navigation;
