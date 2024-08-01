import React, { useState, useEffect } from "react";
import axios from 'axios'; 
import './Recommend.css';

export default function Home() {
  const [topUsers, setTopUsers] = useState([]);
  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    if (!userId) {
      console.error('User ID not found in local storage');
      return;
    }
    axios.get(`http://localhost:8000/api/user/fetchTopUsers/${userId}`)
      .then(response => {
        setTopUsers(response.data.topUsers);
      })
      .catch(error => {
        console.error('Error fetching top users:', error);
      });
  }, [userId]); 
  
  const sendFriendRequest = (receiverId) => {
    axios.post('http://localhost:8000/api/friends/sendRequest', {
      senderId: userId,
      receiverId: receiverId,
    })
    .then(response => {
      console.log('Friend request sent:', response.data);
    })
    .catch(error => {
      console.error('Error sending friend request:', error);
    });
  };
  
  return (
    <div className="RightBar">
      <h1>Recommend People</h1>
      <hr />
      {topUsers && topUsers.length > 0 ? (
        topUsers.map((user) => (
          <div key={user._id} className="userCard">
            <img
              src={`http://localhost:8000/${user.profilePic}`}
              alt="unknown"
              className="profile-pic"
            />
            <div className="user-details">
              <span>{user.name}</span>
              <button onClick={() => sendFriendRequest(user._id)}>Follow</button>
            </div>
          </div>
        ))
      ) : (
        <p>No user to display</p>
      )}
    </div>
  );
}