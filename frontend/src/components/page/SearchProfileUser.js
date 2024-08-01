import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './searchUser.css';

export default function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/${userId}`);
        setUser(response.data);
        console.log(response.data)
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="profile-containerr">
     <div className="profile-headerr">
            <img
              src={`http://localhost:8000/${user.profilePic.replace(/\\/g, '/')}`}
              alt="Profile"
              className="profile-pict"
            />
            <div className="profile-info">
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-handle">{user.email}</p>
              <div className="profile-stats">
                {/* Add any stats if needed */}
              </div>
              <button className="message-button">Message</button>
            </div>
          </div>
    </div>
  );
}
