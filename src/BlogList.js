import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import blogs from './blogs.json'; // Adjust the path if necessary
import './App.css';

const BlogList = () => {
  const [blogList, setBlogList] = useState([]);

  useEffect(() => {
    setBlogList(blogs);
  }, []);

  return (
    <div className="blog-list">
      {blogList.map((blog) => (
        <div key={blog.id} className="blog-list-item">
          <div className="author-info">
            <img src={blog.authorAvatar} alt={blog.authorName} className="author-avatar" />
            <span>{blog.authorName}</span>
          </div>
          <Link to={`/insights/${blog.id}`} className="blog-link">
            <h2 className="blog-title">{blog.title}</h2>
            <p className="blog-description">{blog.description}</p>
          </Link>
          <div className="blog-footer">
            <span className="blog-date">{blog.date}</span>
            <div className="blog-actions">
              <span>⋮</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
