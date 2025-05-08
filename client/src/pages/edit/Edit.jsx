import React, { useEffect, useState } from 'react';
import './edit.css'

const Edit = () => {
  const userId = localStorage.getItem('userId');
  const [user, setUser] = useState({ username: '', email: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/getuser/${userId}`);
        const data = await res.json();
        setUser({
          username: data.user.username || '',
          email: data.user.email || ''
        });
      } catch (err) {
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
    else {
      setError('User not logged in.');
      setLoading(false);
    }
  }, [userId]);

  const handleChange = e => {
    setUser(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('email', user.email);
    if (file) formData.append('file', file);

    try {
      const res = await fetch(`http://localhost:4000/api/edit/${userId}`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Update failed');
      setSuccess(true);
    } catch (err) {
      setError('Error updating user details');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading user data...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>

      {success && <p className="text-green-600 mb-4 text-center">Profile updated successfully!</p>}

      <form onSubmit={handleSubmit} className="edit-form" encType="multipart/form-data">
        <input
          name="username"
          value={user.username}
          onChange={handleChange}
          placeholder="Username"
          className="edit-input"
          required
        />
        <input
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
          className="edit-input"
          required
        />
        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={handleFileChange}
          className="edit-file"
        />
        <button type="submit" className="edit-button">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Edit;
