import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './comment.css';

const CommentSection = ({ postId, fetchPosts }) => {
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/post/${postId}/comments`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await axios.post(
        `http://localhost:8000/api/post/${postId}/comments`,
        { content: commentContent, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCommentContent('');
      fetchComments();
      fetchPosts();

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Comment added successfully!',
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Comment addition failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId, content) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/api/post/comments/${commentId}`, // Replace 'your-backend-url' with your actual backend URL
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      fetchComments();
  
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Comment updated successfully!',
      });
    } catch (error) {
      console.error('Error editing comment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Comment editing failed. Please try again.',
      });
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8000/api/post/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      fetchComments();
  
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Comment deleted successfully!',
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Comment deletion failed. Please try again.',
      });
    }
  };
  

  const handleReportComment = async (commentId, postId) => {
    try {
      const token = localStorage.getItem('token');
      const reason = prompt('Enter the reason for reporting this comment:');
  
      if (!reason) {
        throw new Error('Reason is required.');
      }
  
      const response = await axios.post(
        `http://localhost:8000/api/post/report/comment/${commentId}`,
        { userId: localStorage.getItem('userId'), reason, postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Comment reported successfully!',
      });
    } catch (error) {
      console.error('Error reporting comment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Comment report failed. Please try again.',
      });
    }
  };
  

  return (
    <div className="comment-section">
      <textarea
        placeholder="Add a comment..."
        rows={2}
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
      />
      <button onClick={handleAddComment} disabled={loading}>
        Comment
      </button>
      <h4>Comments</h4>
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <div className="comment-user-info">
              <img
                src={`http://localhost:8000/${comment.userId.profilePic}`}
                alt="Profile"
                className="comment-profile-pic"
              />
              <div className="comment-user-details">
                <p className={comment.userId._id === comment.postId ? 'comment-owner' : ''}>
                  {comment.userId.name || comment.userId.email}
                </p>
              </div>
            </div>
            {selectedCommentId === comment._id ? (
              <div>
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
                <button onClick={() => handleEditComment(comment._id, commentContent)}>
                  Save
                </button>
                <button onClick={() => setSelectedCommentId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>{comment.content}</p>
                <div className="post-header">
                  <div className="dropdown">
                    <button className="dropbtn">Actions</button>
                    <div className="dropdown-content">
                      <button onClick={() => setSelectedCommentId(comment._id)}>Edit</button>
                      <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                      <button onClick={() => handleReportComment(comment._id)}>Report</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
