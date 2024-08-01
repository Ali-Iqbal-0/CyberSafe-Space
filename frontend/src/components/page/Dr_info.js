import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './DoctorProfileSetup.css'; // Import your CSS file

const MySwal = Swal;

export default function DoctorProfileSetup() {
  const [certificationInputs, setCertificationInputs] = useState([]);
  const [availability, setAvailability] = useState([]);
  const navigate = useNavigate();
  const [degree, setDegree] = useState('');

  const handleCertificationsChange = (index, e) => {
    const files = e.target.files;
    setCertificationInputs([
      ...certificationInputs.slice(0, index),
      ...files,
      ...certificationInputs.slice(index + 1),
    ]);
  };

  const handleDegreeChange = (e) => {
    setDegree(e.target.value);
  };

  const handleAvailabilityChange = (index, e) => {
    const { name, value } = e.target;
    setAvailability([
      ...availability.slice(0, index),
      { ...availability[index], [name]: value },
      ...availability.slice(index + 1),
    ]);
  };

  const addCertificationInput = () => {
    setCertificationInputs([...certificationInputs, []]);
  };

  const removeCertificationInput = (index) => {
    setCertificationInputs([
      ...certificationInputs.slice(0, index),
      ...certificationInputs.slice(index + 1),
    ]);
  };

  const addAvailability = () => {
    setAvailability([...availability, { day: '', startTime: '', endTime: '' }]);
  };

  const removeAvailability = (index) => {
    setAvailability([...availability.slice(0, index), ...availability.slice(index + 1)]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append certifications data to formData
    certificationInputs.forEach((certification, index) => {
      formData.append('certifications', certification);
    });

    // Append degree and availability data to formData
    formData.append('degree', degree);
    formData.append('availability', JSON.stringify(availability));

    try {
      const token = localStorage.getItem('token');

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      // Make the axios POST request to your backend API
      const response = await axios.post('http://localhost:8000/api/user/uploadCertifications', formData, config);

      // Handle successful response from backend
      if (response.status === 200) {
        MySwal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Profile setup complete!',
        });
        navigate('/homeDoctor'); // Navigate to the desired route upon success
      } else {
        // Handle other status codes if needed
        console.log('Unexpected status code:', response.status);
      }
    } catch (error) {
      console.error('AxiosError:', error);
      // Handle error response from backend
      if (error.response) {
        console.log('Error response from server:', error.response.data);
        MySwal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Profile setup failed. Please try again.',
        });
      } else if (error.request) {
        console.log('No response received:', error.request);
        MySwal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'No response received from server. Please check your network connection.',
        });
      } else {
        console.log('Error in request:', error.message);
        MySwal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'An unexpected error occurred. Please try again later.',
        });
      }
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="DoctorProfileSetup">
          <h1>Doctor Profile Setup</h1>
          <div className="input-field">
            <label htmlFor="degree">Most Recent Degree:</label>
            <input type="text" id="degree" name="degree" value={degree} onChange={handleDegreeChange} />
          </div>
          <div className="upload-section">
            <h2>Upload Certifications</h2>
            {certificationInputs.map((_, index) => (
              <div key={index} className="certification-input">
                <input type="file" multiple onChange={(e) => handleCertificationsChange(index, e)} />
                <button type="button" onClick={() => removeCertificationInput(index)}>Remove</button>
              </div>
            ))}
            <button type="button" className='button-55' onClick={addCertificationInput}>Add Another Certification Slot</button>
          </div>
          <div className="availability-section">
            <h2>Set Availability</h2>
            {availability.map((slot, index) => (
              <div key={index} className="availability-input">
                <input type="text" name="day" value={slot.day} onChange={(e) => handleAvailabilityChange(index, e)} placeholder="Day" />
                <input type="text" name="startTime" value={slot.startTime} onChange={(e) => handleAvailabilityChange(index, e)} placeholder="Start Time" />
                <input type="text" name="endTime" value={slot.endTime} onChange={(e) => handleAvailabilityChange(index, e)} placeholder="End Time" />
                <button type="button"  onClick={() => removeAvailability(index)}>Remove</button>
              </div>
            ))}
            <button type="button" className='button-55' onClick={addAvailability}>Add Another Slot</button>
          </div>
          <button type="submit" className='button-33'>Complete Profile Setup</button>
        </div>
      </form>
    </div>
  );
}
