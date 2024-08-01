import React from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import './Sidebar_admin.css';
import {  useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };
  return (
    <div>
      <header className='header'>
        <div className='header-left'>
          CyberSafe Space
        </div>
      </header>
      <div className='sidebar'>
        <Link to="/AdminReport">Reported Posts</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/ReportedComment">Reported Comments</Link>
        <Link to="/admin/users">User Management</Link>
        <button alt="LoG out" className='btn2' onClick={handleLogout}>
  <i>L</i><i>O</i><i>G</i><i>&nbsp;</i><i>O</i><i>U</i><i>T</i>
</button>

      </div>
      <main className='main-container'>
      Admin Dashboard
      <hr ></hr>
        <div className='main-cards'>
          <Link to="/AdminReport" className='card'>
            <div className='card-inner'>
              <h3>Reported Posts</h3>
              <BsFillArchiveFill className='card_icon' />
            </div>
          </Link>
          <Link to="/resources" className='card'>
            <div className='card-inner'>
              <h3>Resources</h3>
              <BsFillGrid3X3GapFill className='card_icon' />
            </div>
          </Link>
          <Link to="/ReportedComment" className='card'>
            <div className='card-inner'>
              <h3>Reported Comments</h3>
              <BsPeopleFill className='card_icon' />
            </div>
          </Link>
          <Link to="/admin/users" className='card'>
            <div className='card-inner'>
              <h3>User Management</h3>
              <BsFillBellFill className='card_icon' />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
