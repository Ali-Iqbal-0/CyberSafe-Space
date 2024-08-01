import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './messages.css';

const socket = io('http://localhost:5000'); // Adjust to your backend URL

const Chat = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchUser(userId);
      socket.emit('joinRoom', userId);
      fetchMessages(userId);
    }

    socket.on('message', (newMessage) => {
      // Update messages state
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Notify the recipient if they are not the sender
      if (newMessage.receiver === user._id) {
        // Add the new message to notifications
        console.log('Notifications:', notifications);
        setNotifications((prevNotifications) => [...prevNotifications, newMessage]);
        // Show toast notification
        toast.info(`New message from ${newMessage.sender.name}: ${newMessage.message}`);
      }
    });

    return () => {
      socket.off('message');
    };
  }, [user]);

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/user/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchMessages = async (loggedInUserId, selectedUserId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/messages/${loggedInUserId}/${selectedUserId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/user/search?query=${searchQuery}`);
      const users = response.data.users;
      if (searchQuery === user.name) {
        handleSelectUser(user);
      } else {
        setSearchResults(users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleSelectUser = async (selectedUser) => {
    setSelectedUser(selectedUser);
    clearNotifications(selectedUser._id); // Clear notifications when user checks messages
    setMessages([]); // Clear existing messages
    fetchMessages(user._id, selectedUser._id); // Pass both IDs
  };

  const handleSendMessage = async () => {
    const newMessage = {
      sender: user._id,
      receiver: selectedUser._id,
      message,
    };
    try {
      await axios.post('http://localhost:8000/api/messages/send', newMessage);
      socket.emit('message', newMessage); // Emit the message directly, no need for room
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const clearNotifications = (userId) => {
    setNotifications(notifications.filter((notification) => notification.receiver !== userId));
  };

  return (
    <div className="chat-container">
      <ToastContainer />
      <div className="notifications">
        <button onClick={handleToggleNotifications}>
          Notifications ({notifications.length})
        </button>
        {showNotifications && (
          <div className="notifications-dropdown">
            {notifications.length === 0 ? (
              <p>No new notifications</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification._id} className="notification">
                  <strong>{notification.sender.name}: </strong>
                  {notification.message}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <div className="search-users">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
        />
        <button onClick={handleSearch}>Search</button>
        <ul>
          {searchResults.map((result) => (
            <li key={result._id} onClick={() => handleSelectUser(result)}>
              <img src={`http://localhost:8000/${result.profilePic}`} alt={`${result.name}'s profile`} className="profile-pic" />
              {result.name}
            </li>
          ))}
        </ul>
      </div>
      {selectedUser && (
        <div className="chat-window">
          <div className="sender-chat">
            <h2>Chat with {selectedUser.name}</h2>
            <img src={`http://localhost:8000/${selectedUser.profilePic}`} alt={`${selectedUser.name}'s profile`} className="profile-pic" />
            <div>
              {messages.map((msg) => (
                <div key={msg._id} className={`message ${msg.sender._id === user._id ? 'sender' : 'receiver'}`}>
                  <strong>{msg.sender._id === user._id ? 'You' : msg.sender.name}: </strong>
                  {msg.message}
                </div>
              ))}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
