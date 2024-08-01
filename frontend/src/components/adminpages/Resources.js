import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Swal from 'sweetalert2';
import './resources.css';

const App = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!userId) {
        throw new Error('User ID not found in localStorage');
      }

      const response = await axios.get('http://localhost:8000/api/resources/getresources', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'userId': userId // Custom header for user ID
        }
      });

      console.log('Fetch response:', response); // Debug log
      setPosts(response.data.resources);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Error fetching posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!userId) {
        throw new Error('User ID not found in localStorage');
      }

      const formData = new FormData();
      formData.append('content', content);
      formData.append('userId', userId);

      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post(
        'http://localhost:8000/api/resources/createresource',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContent('');
      setImage(null);
      fetchPosts();

      if (response.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Post created successfully!',
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Post creation failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleEditPost = (postId, currentContent) => {
    setCurrentPostId(postId);
    setNewContent(currentContent);
    setIsModalOpen(true);
  };

  const handleUpdatePost = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/api/resources/edit/${currentPostId}`,
        { content: newContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsModalOpen(false);
      fetchPosts();

      if (response.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Post updated successfully!',
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Post update failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.delete(
        `http://localhost:8000/api/resources/delete/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPosts();

      if (response.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Post deleted successfully!',
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Post deletion failed. Please try again.',
      });
    }
  };

  const handleReportPost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const reason = prompt('Enter the reason for reporting this post:');

      if (!reason) {
        throw new Error('Reason is required.');
      }

      const response = await axios.post(
        `http://localhost:8000/api/resources/report/${postId}`,
        { userId: localStorage.getItem('userId'), reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Post reported successfully!',
      });
    } catch (error) {
      console.error('Error reporting post:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Post report failed. Please try again.',
      });
    }
  };

  const DropdownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
      <path d="M4 6l4 4 4-4z" />
    </svg>
  );

  return (
    <div className="center-column">
      <div className="post-text-area">
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="What's on your mind?"
            rows={4}
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="imageInput"
              style={{ display: 'none' }}
            />
            <label htmlFor="imageInput" className="image-upload-button">
              <AddPhotoAlternateIcon />
            </label>
            {image && <span>{image.name}</span>}
          </div>
          <div className="post-actions">
            <button type="submit" disabled={loading}>
              Post
            </button>
          </div>
        </form>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {posts.map((post) => (
        <div key={post._id} className="post">
          <div className="post-header">
            <div className="dropdown">
              <button className="dropbtn">
                <DropdownIcon />
              </button>
              <div className="dropdown-content">
                <button onClick={() => handleEditPost(post._id, post.content)}>Edit</button>
                <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                <button onClick={() => handleReportPost(post._id)}>Report</button>
              </div>
            </div>
          </div>
          <div className="post-content">
            <div className="post-user-info">
              {post.userId && post.userId.profilePic ? (
                <img
                  src={`http://localhost:8000/${post.userId.profilePic}`}
                  alt="Profile"
                  className="post-profile-pic"
                />
              ) : (
                <div className="default-profile-pic"></div>
              )}
              <div className="post-user-details">
                {post.userId ? (
                  post.userId.name ? (
                    <p>{post.userId.name}</p>
                  ) : post.userId.email ? (
                    <p>Email by: {post.userId.email}</p>
                  ) : (
                    <p>Unknown User</p>
                  )
                ) : (
                  <p>Unknown User</p>
                )}
              </div>
            </div>
            <p>{post.content}</p>
            {post.image && (
              <img
                src={`http://localhost:8000/${post.image}`}
                alt="Post"
                className="post-image"
              />
            )}
          </div>
        </div>
      ))}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit Post"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Edit Post</h2>
        <textarea rows={4} value={newContent} onChange={(e) => setNewContent(e.target.value)} />
        <button onClick={handleUpdatePost} disabled={loading}>Update</button>
        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
      </Modal>
    </div>
  );
};

export default App;
