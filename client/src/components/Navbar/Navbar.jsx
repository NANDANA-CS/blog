import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import './navbar.css';
import axios from 'axios';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({ username: '', profilePic: null });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); 
  const dropdownRef = useRef(null);
  const [profile, setProfile] = useState()

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  }

  const handleWriteClick = () => {
    navigate('/write');
  }

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  }

  async function getuser() {
    const id = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!id || id === 'null' || !token) {
      localStorage.clear();
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/api/getuser/${id}`);
      console.log(response)
      setUserData({
        username: response.data.user.username || 'Guest',
        profilePic: response
          ? `http://localhost:4000/images/${response.data.user.profile_pic}`
          : null,
      });

      console.log("gcfcfcggh")
      console.log(userData)
      setError(null);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  }


  useEffect(() => {
    getuser();
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };


  }, [dropdownOpen]);

  

  return (
    <nav className="navbar">
      {error && <p className="error-text">{error}</p>}
      <div className="nav-left">
        <h1 className="logo">Blog Spot</h1>
        <div className="search-container">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          <input type="text" placeholder="Search blogs" className="search-input" />
        </div>

      </div>
      <div className="nav-right">
        <button className="icon-button write-button" onClick={handleWriteClick}>
          <svg className="icon write-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 4H7a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3v-4m-1.586-8.586a2 2 0 010 2.828L12.828 13H12v-2.828l6.586-6.586a2 2 0 012.828 0z"
            ></path>
          </svg>
          <span className="write-text">Create</span>
        </button>
       

        <span className="welcome-message">{userData.username}</span>
        <div className="profile-container" ref={dropdownRef}>
          <img
            src={userData.profilePic || 'https://via.placeholder.com/50?text=User'}
            alt="Profile"
            className="profile-pic"
            onClick={handleProfileClick}

          />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => {
                  navigate('/profile');
                  setDropdownOpen(false);
                }}
              >
                Profile
              </button>
              <button onClick={logout} className="dropdown-item">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



