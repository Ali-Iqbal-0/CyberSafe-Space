import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Resetpassword.css';
const MySwal = Swal;

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [password_confirmation, setConfirmPassword] = useState('');
  const { userID, token } = useParams();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response =await axios.post(`http://localhost:8000/api/user/reset-password/${userID}/${token}`, {
        password,
        password_confirmation,
      });
      if (response.data.status === 'success') {
        MySwal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Registration successful!',
        });
        setRegistrationSuccess(true);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      MySwal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Registration failed. Please try again.',
      });
    }
   
  };
  if (registrationSuccess) {
    return (
      <div className="success-message">
        <h1>Reset password Successful</h1>
        <p>Redirecting to Login page...</p>
        {setTimeout(() => {
          window.location.href = '/login'; 
        }, 5000)}
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <h1>Reset Password</h1>
      <hr className="hr2"></hr>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={password_confirmation}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
