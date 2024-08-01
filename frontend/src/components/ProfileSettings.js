import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import axios from 'axios';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [friends, setFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/user/loggeduser', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        console.log(data); // Check the structure of data received
        setUserData(data.user); // Assuming user data is nested under 'user' key
      } catch (error) {
        console.error(error);
        // Handle error, such as redirecting to login page
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/friends/${userId}/fetchfriend`)
      .then(response => {
        // Handle the response data
        setFriends(response.data.requests);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching friend requests:', error);
      });
  }, [userId]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/post/fetchuserpost/${userId}`)
      .then(response => {
        setPosts(response.data.posts);
        console.log(response.data.posts);
      })
      .catch(error => {
        console.error('Error fetching user posts:', error);
      });
  }, [userId]);

  return (
    <div className="profile-container">
      {userData ? (
        <>
          <div className="profile-header">
            <img
              src={userData.profilePic ? `http://localhost:8000/${userData.profilePic}` : 'default-profile-pic-url'}
              alt="Profile"
              className="profile-dp"
            />
            <div className="profile-info">
              <h1 className="profile-name">{userData.name}</h1>
              <p className="profile-handle">{userData.email}</p>
              <div className="profile-stats">
                {/* Add any stats if needed */}
              </div>
              <button className="message-button">Message</button>
            </div>
          </div>
          <div className="profile-tabs"></div>
          <div className="profile-content">
            <div className="friends-section">
              <h2>Followers</h2>
              <div className="friends-list">
                {friends && friends.map(friend => (
                  <div key={friend._id} className="friend-card">
                    <img
                      src={friend.senderId && friend.senderId.profilePic ? `http://localhost:8000/${friend.senderId.profilePic}` : 'default-friend-profile-pic-url'}
                      alt={friend.senderId ? friend.senderId.name : 'Unknown'}
                      className="friend-profile-pic"
                    />
                    <div className="friend-info">
                      <h2 className="friend-name">{friend.senderId ? friend.senderId.name : 'Unknown'}</h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="content-section">
              <h2>Post</h2>
              <div className="content-cards">
                {posts && posts.map(post => (
                  <div key={post._id} className="content-card">
                    <div className="content-details">
                      <p className="content-date">Published Date: {new Date(post.createdAt).toLocaleDateString()}</p>
                      <p className="content">{post.content}</p>
                      {post.image && (
                        <img
                          src={`http://localhost:8000/${post.image}`}
                          alt="Post content"
                          className="content-img"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="loading-text">Loading user data...</p>
      )}
    </div>
  );
};

export default UserProfile;
