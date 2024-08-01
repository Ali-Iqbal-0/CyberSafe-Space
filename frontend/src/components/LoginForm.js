import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Login.css';
const MySwal = Swal;

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/user/login", {
        email,
        password
      });
      if (response.data.status === 'success') {
        const { token, user } = response.data; // Assuming the token and user ID are received from the server
        localStorage.setItem('token', token); // Save the token in localStorage
        if (user && user._id) {
          localStorage.setItem('userId', user._id); // Save the user ID in localStorage if it exists
        }
        const { role } = response.data.user;
        MySwal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Login successful!',
        });
        if (role === 'admin') {
          navigate('/homeAdmin');
        } else if (role === 'Doctor') {
          navigate('/homeDoctor');
        } else {
          navigate('/homeUser');
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Login failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-form1" onSubmit={handleLogin}>
    <div className="Login1">
      <div className="CyberSafe1">
        <div className="CyberSafe1-name">  
          CyberSafe Space
        </div>
        <div className="title1">
          CyberSafe Space helps you connect and share 
          <br />
          with the people in your life.
        </div>
      </div>      
      <div className="loginContainer1">      
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password" 
        />
        <br />
        {loading ? (
          <div>Loading...</div>
        ) : (
          <button className="btn1" type='submit'>
            LOGIN
          </button>
        )}
        <div className="forget1">
          <Link to="/forgotpassword">Forgotten Account ?</Link>
          <br />
        </div>
        <div className="create1">
          <br /> 
          <Link to="/register" >
          <button className="btns1" type='submit'>
           Create New Account
          </button>
          </Link>
        </div>
        <br />
      </div>
    </div>
   
  </form>
  );
}

export default LoginForm;
