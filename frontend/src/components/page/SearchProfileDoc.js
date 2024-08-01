import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUserDoctor } from "react-icons/fa6";
import '../DocProfile.css';

export default function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/doc/${userId}`);
        setUser(response.data);
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
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={`http://localhost:8000/${user.profilePic}`}
          alt="Profile"
          className="profile-picc"
        />
        <div className="profile-info">
          <h1 className="profile-name">{user.name}<FaUserDoctor className="navIcon" /></h1>
          <p className="profile-email">{user.email}</p>
          {/* Display certifications data */}
         
          <div className="profile-stats">
            {/* Add any stats if needed */}
          </div>
          <button className="message-button">Message</button>
        </div>
      </div>
      {user.certifications && (
            <div className="certifications">
              <h2>Certifications</h2>
              <ul>
                {user.certifications.map((cert, index) => (
                  <li key={index}>
                    {cert.degree}
                    {/* Display nested arrays */}
                    {cert.availability && (
                      <ul>
                        {cert.availability.map((avail, idx) => (
                          <li key={idx}>
                            {avail.day}: {avail.startTime} - {avail.endTime}
                          </li>
                        ))}
                      </ul>
                    )}
                    {cert.certifications && (
                      <ul>
                        {cert.certifications.map((certItem, idx) => (
                          <li key={idx}>
                            <img src={`http://localhost:8000/${certItem.path}`} alt="Certification" />
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
    </div>
  );
}
