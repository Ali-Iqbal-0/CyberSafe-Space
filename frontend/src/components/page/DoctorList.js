import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './DoctorList.css'; // Make sure to import the CSS file

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const userId = localStorage.getItem('userId'); 
        const response = await axios.get(`http://localhost:8000/api/user/doctorsList/${userId}`, {
          headers: { 'Authorization': `Bearer ${userId}` } 
        });
        console.log(response.data.doctors)
        setDoctors(response.data.doctors);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Failed to fetch doctors. Please try again later.');
        }
        console.error('Error fetching doctors:', error.response ? error.response.data : error.message);
      }
    };
    fetchDoctors();
  }, []);

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="doctor-list-container">
      <h1>List of Doctors</h1>
      <ul>
        {doctors.map(doctor => (
          <li key={doctor._id} className='liii'>
            <Link to={`/doctorProfile/${doctor._id}`}>
            <img
              src={`http://localhost:8000/${doctor.profilePic}`}
              alt="Profile"
              className="doctor-image"
            />
              <span>{doctor.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
