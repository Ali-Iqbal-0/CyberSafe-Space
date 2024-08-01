import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ForgotPasswordForm.css';

const MySwal = Swal;

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/user/send-reset-password-email", { email });
      if (response.data.status === 'success') {
        MySwal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Link sent successfully!',
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      MySwal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Link sending failed. Please try again.',
      });
    }
  };

  return (
    <div className="forgotpasswordcontainer">
      <h1>CyberSafe Space</h1>
      <hr className="hr2" />
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Please Enter Your Email" 
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
