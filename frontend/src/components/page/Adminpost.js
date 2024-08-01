import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminpost.css';

const AdminPostList = () => {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get('http://localhost:8000/api/resources/getresources', { headers });
        setResources(response.data.resources);
      } catch (error) {
        setError('Error fetching resources');
      }
    };

    fetchResources();
  }, []);

  if (error) {
    return <div className="admin-post-list-error">{error}</div>;
  }

  return (
    <div className="center-column">
    ADMIN ALL RESOURCES
      <ul className="admin-post-list-items">
        {resources.map(resource => (
          <li key={resource._id} className="post">
            <div className="user-profile">
              <img
                src={`http://localhost:8000/${resource.userId.profilePic}`} // Assuming profilePic is the field containing the profile picture path
                alt={resource.userId.name}
                className="profile-pic"
              />
              <div className="user-info">
                <div className="userContent">{resource.content}</div>
              </div>
            </div>
            {resource.image && (
              <div className="post-image">
                <img
                  src={`http://localhost:8000/${resource.image}`}
                  alt="Post"
                  className="post-img"
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPostList;
