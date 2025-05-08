import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';
import Nav from '../../components/nav2/Nav';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    const newErrors = {};

    switch (name) {
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
      const response = await axios.post('http://localhost:4000/api/login', formData);
      console.log('Login successful:', response.data);
      setErrors({});
      console.log(response.data);
      
      localStorage.setItem("token",response.data.token)
      localStorage.setItem('userId',response.data.id)
      toast.success('Successfully logged in!', {
        onClose: () => navigate('/'),
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Login error:', errorMessage);
      setErrors({ api: errorMessage });
    }
  };

  return (
   <>

   <Nav/>
    <div className="login-page">
      <ToastContainer />
      
      <div className="form-wrapper">
        <h2 className="title">LOGIN</h2>
        {errors.api && <p className="error-text">{errors.api}</p>}
        <form onSubmit={handleSubmit} className="form">
          <div className="input-group" key="email">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`input ${errors.email ? 'input-error' : ''}`}
              placeholder="Enter your email"
              required
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
              required
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="button">Log In</button>

          <p className="signup-text">
            Don't have an account?{' '}
            <Link to="/signup" className="signup-link">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
   </>
  );
};

export default Login;




// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './login.css';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const validateField = (name, value) => {
//     const newErrors = {};

//     switch (name) {
//       case 'email':
//         if (!value) {
//           newErrors.email = 'Email is required';
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//           newErrors.email = 'Invalid email format';
//         }
//         break;

//       case 'password':
//         if (!value) {
//           newErrors.password = 'Password is required';
//         }
//         break;

//       default:
//         break;
//     }

//     return newErrors;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     const fieldErrors = validateField(name, value);
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [name]: fieldErrors[name],
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const allErrors = {};
//     Object.keys(formData).forEach((key) => {
//       const fieldErrors = validateField(key, formData[key]);
//       Object.assign(allErrors, fieldErrors);
//     });

//     if (Object.keys(allErrors).length > 0) {
//       setErrors(allErrors);
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:4000/api/login', formData);
//       console.log('Login successful:', response.data);
//       setErrors({});
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('userId', response.data.id);
//       navigate('/'); // Redirect to homepage immediately
//       toast.success('Successfully logged in!', {
//         autoClose: 2000, // Close toast after 2 seconds
//       });
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message;
//       console.error('Login error:', errorMessage);
//       setErrors({ api: errorMessage });
//       toast.error(errorMessage, {
//         autoClose: 3000,
//       });
//     }
//   };

//   return (
//     <div className="login-page">
//       <ToastContainer />
//       <div className="form-wrapper">
//         <h2 className="title">LOGIN</h2>
//         {errors.api && <p className="error-text">{errors.api}</p>}
//         <form onSubmit={handleSubmit} className="form">
//           <div className="input-group" key="email">
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className={`input ${errors.email ? 'input-error' : ''}`}
//               placeholder="Enter your email"
//               required
//             />
//             {errors.email && <p className="error-text">{errors.email}</p>}
//           </div>

//           <div className="input-group" key="password">
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               className={`input ${errors.password ? 'input-error' : ''}`}
//               placeholder="Enter your password"
//               required
//             />
//             {errors.password && <p className="error-text">{errors.password}</p>}
//           </div>

//           <div className="forgot-password">
//             <Link to="/forgot-password" className="forgot-link">
//               Forgot Password?
//             </Link>
//           </div>

//           <button type="submit" className="button">Log In</button>

//           <p className="signup-text">
//             Don't have an account?{' '}
//             <Link to="/signup" className="signup-link">
//               Sign Up
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;