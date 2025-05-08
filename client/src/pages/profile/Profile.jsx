import React, { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import './profile.css';
import Navbar from '../../components/Navbar/Navbar';

const Profile = () => {
  const navigate = useNavigate();
  const [activeOption, setActiveOption] = useState('myblogs');

  const handleHome = () => navigate('/');

  return (
    <>

     <Navbar />
    <div className="profile-page">
      <div className="sidebar">
        <ul className="sidebar-menu">
          <li>
            <NavLink
              to="userblog"
              className={({ isActive }) => `sidebar-button ${isActive ? 'active' : ''}`}
              onClick={() => setActiveOption('userblog')}
              >
              My Blogs
            </NavLink>
          </li>
         

          <li>
            <NavLink
              to="userblog"
              className={({ isActive }) => `sidebar-button ${isActive ? 'active' : ''}`}
              onClick={() => setActiveOption('userblog')}
              >
              My Blogs
            </NavLink>
          </li>

          <li>
            <NavLink
              to="edit"
              className={({ isActive }) => `sidebar-button ${isActive ? 'active' : ''}`}
              onClick={() => setActiveOption('edit')}
              >
              Edit Profile
            </NavLink>
          </li>
          <li>
            <button
              className={`sidebar-button ${activeOption === 'home' ? 'active' : ''}`}
              onClick={handleHome}
              >
              Go Back Home
            </button>
          </li>
        </ul>
      </div>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  </>
  );
};

export default Profile;
