import React, { useEffect, useState } from 'react';
import './DocProfile.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUserDoctor } from "react-icons/fa6";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/profileDr/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setUserData(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, token]);

  const handleDeleteCertification = async (certId) => {
    try {
      await axios.delete(`http://localhost:8000/api/user/deleteCertification/${userId}/${certId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData((prevData) => ({
        ...prevData,
        certifications: prevData.certifications.filter(cert => cert._id !== certId),
      }));
    } catch (error) {
      console.error('Error deleting certification:', error);
    }
  };

  const handleDeleteAvailabilitySlot = async (slotId) => {
    try {
      await axios.delete(`http://localhost:8000/api/user/deleteAvailabilitySlot/${userId}/${slotId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData((prevData) => ({
        ...prevData,
        availability: prevData.availability.filter(slot => slot._id !== slotId),
      }));
    } catch (error) {
      console.error('Error deleting availability slot:', error);
    }
  };

  return (
    <div className="profile-container">
      {userData ? (
        <>
          <div className="profile-header">
            <img
              src={`http://localhost:8000/${userData.profilePic.replace(/\\/g, '/')}`}
              alt="Profile"
              className="profile-picc"
            />
            <div className="profile-info">
              <h1 className="profile-name">{userData.name} <FaUserDoctor className="navIcon" /></h1>
              <p className="profile-handle">{userData.email}</p>
              <div className="profile-stats">
                {/* Add any stats if needed */}
              </div>
              <button className="message-button"> <Link to="/Messages">
              Messages
            </Link></button>
            </div>
          </div>
          <div className="profile-tabs"></div>
          <div className="profile-content">
            <div className="friends-section">
            <hr></hr>
              <h2>Certificates</h2><hr></hr>
              <div className="friends-list">
                {userData.certifications && userData.certifications.map((cert, index) => (
                  <div key={cert._id} className="certificate-item">
                    <img
                      src={`http://localhost:8000/${cert.path.replace(/\\/g, '/')}`}
                      alt={`Certificate ${index + 1}`}
                      className="certificate-img"
                    />
                    <button onClick={() => handleDeleteCertification(cert._id)} className='delete-btn'>Delete</button>
                  </div>
                ))}
               
              </div>
              <button className='button-55'>
                  <Link to="/doctor-info">Add Certification</Link>
                </button>
            </div>
            <div className="content-section">
            <hr></hr>
              <h2>Availability Timing & Location</h2><hr></hr>
              <div className="content-cards">
                {userData.availability && userData.availability.map((slot, index) => (
                  <div key={slot._id} className="availability-item">
                    <p>{slot.day}: {slot.startTime} - {slot.endTime}</p>
                    <button onClick={() => handleDeleteAvailabilitySlot(slot._id)} className='delete-btn'>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="loading-text">Loading user data...</p>
      )}
    </div>
  );
};

export default UserProfile;
