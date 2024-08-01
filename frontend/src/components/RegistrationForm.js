import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Registration.css';

const MySwal = Swal;

export default function Registration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [role, setRole] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [profilePicName, setProfilePicName] = useState('Choose Profile Picture');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !password_confirmation || !role || !profilePic) {
      MySwal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please fill out all required fields.',
      });
      return;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailPattern.test(email)) {
      MySwal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please enter a valid Gmail address (e.g., user@gmail.com).',
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', password_confirmation);
    formData.append('role', role);
    formData.append('profilePic', profilePic);
    console.log(formData)
    try {
      const response = await axios.post("http://localhost:8000/api/user/register", formData);

      if (response.data.status === 'success') {
        MySwal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Registration successful!',
        });
        setRegistrationSuccess(true); // Redirect to Login page for other roles
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
        <h1>Registration Successful</h1>
        <p>Redirecting to Login page...</p>
        {setTimeout(() => {
          window.location.href = '/login';
        }, 5000)}
      </div>
    );
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicName(file.name);
    } else {
      setProfilePic('');
      setProfilePicName('Choose Profile Picture');
    }
  };

  return (
    <div>
      <form className="login-form11" onSubmit={handleSubmit}>
        <div className="Login">
          <div className="CyberSafe1">
            <div className="CyberSafe1-name">
              CyberSafe Space
            </div>
            <div className="title11">
              CyberSafe Space helps you connect and share
              <br />
              with the people in your life.
            </div>
          </div>
          <div className="loginContainer11">
            <input type="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <br />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <br />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <br />
            <input type="password" value={password_confirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="Confirm Password" />
            <br />
            <div className="role-selection">
              <label>
                <input
                  type="radio"
                  value="User"
                  checked={role === 'User'}
                  onChange={(e) => setRole(e.target.value)}
                />
                User
              </label>
              <label>
                <input
                  type="radio"
                  value="Doctor"
                  checked={role === 'Doctor'}
                  onChange={(e) => setRole(e.target.value)}
                />
                Doctor
              </label>
            </div>
            <br />
            <div className="file-input-container">
              <input
                id="profilePic"
                accept="image/*"
                type="file"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="profilePic" className="file-input-label">
                {profilePicName}
              </label>
            </div>
            <button className="btn11" type='submit'>
              Register
            </button>
            <div className="create">
              <br />
              <Link to="/login">
                <button className="btns11" type='button'>
                  All Ready Have Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
