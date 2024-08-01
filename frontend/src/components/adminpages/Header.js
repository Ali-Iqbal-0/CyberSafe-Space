import React, { useEffect, useState } from 'react';
import './Sidebar_admin.css';

function Header() {
  const [user, setuser] = useState({});

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, 
        },
      });
      const data = await response.json();
      setuser(data);
      console.log(data)
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  };

  return (
    <header className='header'>
      <div className='header-left'>
        CyberSafe Space
      </div>
      <div className='header-right'>
        {user.profilePic ? (
          <img
          src={`http://localhost:8000/${user.profilePic}`}
            alt="Profile"
            className="post-profile-pic"
          />
        ) : (
          <div className="default-profile-pic"></div>
        )}
      </div>
    </header>
  );
}

export default Header;
