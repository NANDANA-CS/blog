import React, { useState, useEffect } from 'react';
import './write.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios"

const WriteBlog = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
  });

  const [imagePreview, setImagePreview] = useState(null);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    try {
      const id = localStorage.getItem("userId")
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description)
      data.append("file", formData.file);

      console.log("Form Data:", Object.fromEntries(data));

      const response = await axios.post(`http://localhost:4000/api/write/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if(response.status === 200 || response.status === 201){
        alert("Succes")
        navigate("/profile/userblog")
      }


    } catch (error) {
      console.log("Failed to upload", error)
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="write-page">
      <div className="form-wrapper">
        <h2 className="title">Write Your Blog</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="input-group" key="title">
            <label className="label" htmlFor="title">
              Post Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input"
              placeholder="Enter your blog title"
              required
            />
          </div>

          <div className="input-group" key="description">
            <label className="label" htmlFor="description">
              Tell Your Story
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="textarea"
              placeholder="Start writing your story..."
              required
            />
          </div>

          <div className="image-upload-container" key="image">
            <label htmlFor="file" className="label">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="image-preview"
                />
              ) : (
                <div className="image-placeholder">
                  Upload Blog Image
                </div>
              )}
            </label>
            <input
              type="file"
              id="file"
              name="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>

          <button type="submit" className="button">
            Publish
          </button>
        </form>
      </div>
    </div>
  );
};

export default WriteBlog;
