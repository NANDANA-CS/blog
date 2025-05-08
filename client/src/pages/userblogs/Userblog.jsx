import React, { useEffect, useState } from 'react';
import './userblog.css'

const Userblog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/loadblogs/");
        const data = await response.json();

        console.log("Fetched data:", data);
        console.log(data)

        const blogArray = Array.isArray(data) ? data : data.blogs;

        if (!Array.isArray(blogArray)) {
          throw new Error("API response is not an array of blogs");
        }
        console.log(blogArray)
        const userBlogs = blogArray.reverse().filter(blog => blog.userid === userId);
        console.log(userBlogs)
        setBlogs(userBlogs)
      } catch (error) {
        console.error("Error loading blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [userId]);

  if (!userId) return <p className="text-center mt-10 text-red-500">User not logged in</p>;
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (blogs.length === 0) return <p className="text-center mt-10">You haven't written any blogs yet.</p>;
  

  return (
    <div className="blog-container">
      <h1 className="blog-title">YOUR BLOGS</h1>
      {blogs.map(blog => (
        <div key={blog._id} className="blog-card">
            <div className="blog-content">
            <h2 className="blog-heading">{blog.title}</h2>
            <p className="blog-description">{blog.description}</p>
            </div>
            {blog.blog && blog.blog[0] && (
                <img
                  src={`http://localhost:4000/${blog.blog[0]}`}
                  alt={blog.title}
                  className="blog-image"
                
                />
              )}
        </div>
      ))}
    </div>
  );
};

export default Userblog;
