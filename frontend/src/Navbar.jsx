import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-title">
        <h1>Zomato</h1>
      </div>
      <ul className="navbar-menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/restaurant-by-id">Get Restaurant by ID</Link></li>
        <li><Link to="/search-nearby">Search Nearby</Link></li>
        <li><Link to="/image-search">Image Search</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;