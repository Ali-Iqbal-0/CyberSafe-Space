import React, { useState } from 'react';
import axios from 'axios';
import './ChangePasswordForm.css'; // Importing the CSS file

const ChangePasswordForm = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId'); // Assuming user ID is stored in local storage
    const token = localStorage.getItem('token'); // Assuming token is stored in local storage
    console.log(userId);

    if (!userId) {
      setMessage('User ID not found. Please log in.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/user/changepassword',
        { userId, password, password_confirmation: passwordConfirmation },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error changing password');
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm New Password</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangePasswordForm;
