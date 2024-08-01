import React, { useState } from 'react';
import { Search } from "@mui/icons-material";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "./topbar.css";

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 1) {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/search?query=${e.target.value}`);
        setSearchResults(response.data.users);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (userId) => {
    navigate(`/profile/${userId}`);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="topbarContainer">
      <nav className="navbar">
        <div className="navbar-container container">
          <Link to="/homeUser" className="Logo-name">CyberSafe Space</Link>
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend"
            className="searchInput"
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchResults.length > 0 && (
            <div className="searchResults">
              {searchResults.map(user => (
                <div
                  key={user._id}
                  className="searchResultItem"
                  onClick={() => handleResultClick(user._id)}
                >
                  <img
              src={`http://localhost:8000/${user.profilePic}`}
              alt="Profile"
              className="post-profile-pic"
            />
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
          )}
          <ul className="menu-items">
            <li>
              <button alt="Log out" className='btn99' onClick={handleLogout}>
                <i>L</i><i>O</i><i>G</i><i>&nbsp;</i><i>O</i><i>U</i><i>T</i>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
