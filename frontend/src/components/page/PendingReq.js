import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './pendingReq.css'
const Home = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get(`http://localhost:8000/api/friends/${userId}/requests`)
      .then(response => {
        setPendingRequests(response.data.requests);
      })
      .catch(error => {
        console.error('Error fetching friend requests:', error);
      });
  }, [userId]);

  const handleAccept = (requestId) => {
    axios.put(`http://localhost:8000/api/friends/requests/${requestId}/accept`)
      .then(response => {
        console.log('Friend request accepted:', response.data);
      })
      .catch(error => {
        console.error('Error accepting friend request:', error);
      });
  };

  const handleReject = (requestId) => {
    axios.put(`http://localhost:8000/api/friends/requests/${requestId}/reject`)
      .then(response => {
        console.log('Friend request rejected:', response.data);
      })
      .catch(error => {
        console.error('Error rejecting friend request:', error);
      });
  };

  return (
    <div className="PendingRequests">
      <h1>Pending Follow Requests</h1>
      {pendingRequests.map(request => (
        <div key={request._id} className="requestCard">
        <img
              src={`http://localhost:8000/${request.senderId.profilePic}`}
              alt="Profile"
              className="post-profile-pices"
            />
          <span>{request.senderId.name} Sent you a follow request.</span>
          
          <button className='accept' onClick={() => handleAccept(request._id)}>Accept</button>
          <button className='reject' onClick={() => handleReject(request._id)}>Reject</button>
        </div>
      ))}
    </div>
  );
};

export default Home;
