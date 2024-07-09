import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import blogs from './blogs.json'; // Adjust the path if necessary
import './App.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogData = () => {
      const blog = blogs.find((b) => b.id === parseInt(id));
      if (blog) {
        setBlog(blog);
      } else {
        setError('Blog not found');
      }
    };

    fetchBlogData();
  }, [id]);

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!blog) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="blog-detail">
      <h1 className="blog-title">{blog.title}</h1>
      <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.fulldescription }} />
      <br/>
      <br/>
      <div className="author-info">
            <img src={blog.authorAvatar} alt={blog.authorName} className="author-avatar" />
            <span>{blog.authorName}</span>
          </div>
          <div className="blog-footer">
            <span className="blog-date">{blog.date}</span>
            <div className="blog-actions">
              <span>⋮</span>
            </div>
          </div>
    </div>
  );
};

export default BlogDetail;
