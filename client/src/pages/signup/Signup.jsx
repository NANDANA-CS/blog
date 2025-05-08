import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import './signup.css';
import Nav from '../../components/nav2/Nav';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    file: null,
  });

  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); 


  const validateField = (name, value, allValues = formData) => {
    const newErrors = {};

    switch (name) {
      case 'username':
        if (!value) {
          newErrors.username = 'Username is required';
        } else if (value.length < 3 || value.length > 20) {
          newErrors.username = 'Username must be 3-20 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          newErrors.username = 'Invalid username format';
        }
        break;

      case 'email':
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Invalid email format';
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
        ) {
          newErrors.password =
            'Password must be at least 8 characters, including one uppercase, one lowercase, one number, and one special character';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Confirm password is required';
        } else if (value !== allValues.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;

      case 'file':
        if (value) {
          const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
          if (!validTypes.includes(value.type)) {
            newErrors.file = 'Only JPEG, PNG, or GIF images are allowed';
          } else if (value.size > 5 * 1024 * 1024) {
            newErrors.file = 'Image size must not exceed 5MB';
          }
        }
        break;

      default:
        break;
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const fieldErrors = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldErrors[name],
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileErrors = validateField('file', file);
      if (fileErrors.file) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          file: fileErrors.file,
        }));
        return;
      }

      setFormData({ ...formData, file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, file: null });
      setProfilePicPreview(null);
      setErrors((prevErrors) => ({ ...prevErrors, file: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allErrors = {};
    Object.keys(formData).forEach((key) => {
      const fieldErrors = validateField(key, formData[key]);
      Object.assign(allErrors, fieldErrors);
    });

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('confirmPassword', formData.confirmPassword);
      if (formData.file) {
        data.append('file', formData.file);
      }

      const response = await axios.post('http://localhost:4000/api/signup', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Signup successful:', response.data);
      setErrors({});

 
      alert('Signup successful! Please log in.');
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Signup error:', errorMessage);
      setErrors({ api: errorMessage });
    }
  };

  
  useEffect(() => {
    return () => {
      if (profilePicPreview) {
        URL.revokeObjectURL(profilePicPreview);
      }
    };
  }, [profilePicPreview]);

  return (
  <>

  <Nav/>
    <div className="signup-page">
      <div className="form-wrapper">
        <h2 className="title">SIGN UP</h2>
        {errors.api && <p className="error-text">{errors.api}</p>}
        <form onSubmit={handleSubmit} className="form">
          <div className="profile-pic-container" key="profile-pic">
            <label htmlFor="profile_pic" className="label">
              {profilePicPreview ? (
                <img
                  src={profilePicPreview}
                  alt="Profile Preview"
                  className="profile-pic-preview"
                />
              ) : (
                <div className="profile-pic-placeholder">Upload Profile Picture</div>
              )}
            </label>
            <input
              type="file"
              id="profile_pic"
              name="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
              aria-label="Upload profile picture"
            />
            {errors.file && <p className="error-text">{errors.file}</p>}
          </div>

          <div className="input-group" key="username">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`input ${errors.username ? 'input-error' : ''}`}
              placeholder="Enter your username"
            />
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>

          <div className="input-group" key="email">
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`input ${errors.email ? 'input-error' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="input-group" key="password">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`input ${errors.password ? 'input-error' : ''}`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="input-group" key="confirm-password">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="button">Sign Up</button>

          <p className="login-text">
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  </>
  );
};

export default Signup;