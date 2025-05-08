import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import './nav.css';
import axios from 'axios';

const Nav = () => {
  
  
  return (
    <nav className="navbar">
      <div className="nav-left">
        <h1 className="logo">Blog Spot</h1>
      </div>
    </nav>
  );
};

export default Nav;



