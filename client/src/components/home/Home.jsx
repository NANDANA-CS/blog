import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import './home.css';
import Navbar from '../Navbar/Navbar';


const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [userData, setUserData] = useState({ username: '', email: '', profilePic: null });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');


      if (!token || !userId || userId === 'null') {
        if (isMounted) {
          setError('User not authenticated');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/login');
        }
        return;
      }

      try {
        console.log('fetching user with ID:', userId);
        const userResponse = await axios.get(`http://localhost:4000/api/getuser/${userId}`);
        console.log(userResponse,"thi ")
        if (isMounted) {
          setUserData({
            username: userResponse.data.username || 'Guest',
            email: userResponse.data.email || '',
            profilePic: userResponse.data.profilePic
              ? `http://localhost:4000/${userResponse.data.profilePic}`
              : null,
          });
          setError(null);
        }
        const blogResponse = await axios.get('http://localhost:4000/api/loadblogs');
        console.log(blogResponse,"blogres")
        if (isMounted) {
          const newBlogs1 = (blogResponse.data.blogs || []).filter(blog => blog.userid !== userId);
          const newBlogs = newBlogs1.map((blog) => ({
            ...blog,
            profile_pic: blog.profile_pic || null,
            blog: blog.blog ? blog.blog.map((img) => (img || null)) : [],
          })).reverse();
          setBlogs(newBlogs);
        }
      } catch (error) {
        if (isMounted) {
          const errorMessage = error.response?.data?.message || error.message;
          console.error('Error fetching data:', errorMessage);
          setError(errorMessage);
          // if (error.response?.status === 401 || error.response?.status === 404) {
          //   localStorage.removeItem('token');
          //   localStorage.removeItem('userId');
          //   navigate('/login');
          // }
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLike = (index) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog, i) =>
        i === index
          ? { ...blog, likes: [...(blog.likes || []), 'like'] }
          : blog
      )
    );
  };

  return (
    <>

 <Navbar />
    <div className="home-page">
      {error && <p className="error-text">{error}</p>}
      {userData.username && (
        <div className="user-profile">
          {/* <h2>Welcome, {userData.username}!</h2> */}
          {userData.profilePic && (
            <img
            src={userData.profilePic}
            alt={userData.username}
            className="user-profile-pic"
            
            />
          )}
          {/* <p>Email: {userData.email}</p> */}
        </div>
      )}
      <h1 className="home-title">Featured Blogs</h1>
      <div className="blog-list">
        {blogs.length === 0 ? (
          <p className="no-blogs">No blogs available</p>
        ) : (
          blogs.map((blog, index) => (
            <div key={blog._id || index} className="blog-card">
              <div className="blog-content">
                <div className="blog-meta">
                  {blog.profile_pic && (
                    <img
                    src={`http://localhost:4000/images/${blog.profile_pic}`}
                    alt={blog.username || 'Author'}
                    className="profile-pic"
                    />
                  )}
                  <span className="blog-author">{blog.username || 'Unknown'}</span>
                </div>
                <h2 className="blog-title">{blog.title}</h2>
                <p className="blog-description">{blog.description}</p>
                <div className="blog-actions">
                  <span className="blog-date">
                    {new Date().toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </span>

                </div>
              </div>
              {blog.blog && blog.blog[0] && (
                <img
                src={`http://localhost:4000/${blog.blog[0]}`}
                alt={blog.title}
                className="blog-image"
                
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  </>
  );
};

export default Home;



