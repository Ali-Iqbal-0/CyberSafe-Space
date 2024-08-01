import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Button, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/system';
import { BsFillArchiveFill, BsFillGrid3X3GapFill } from 'react-icons/bs';
import Header from '../adminpages/Header';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: '20px',
  backgroundColor: '#f5f5f5',
  border: '1px solid #ccc',
}));

const StyledCardMedia = styled('img')(({ theme }) => ({
  maxWidth: '50%',
  height: 'auto',
  objectFit: 'contain',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: '10px',
  marginRight: '10px',
  display: 'flex',
}));

const AdminPage = () => {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportedPosts();
  }, []);

  const fetchReportedPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/admin/reported-posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setReportedPosts(response.data.reportedPosts);
      } else {
        setError('Error fetching reported posts');
      }
    } catch (error) {
      setError('No Reported Posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/admin/delete-post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Post deleted successfully!',
      });
      setReportedPosts(reportedPosts.filter(post => post.postId._id !== postId));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Post deletion failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveReport = async (reportId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/admin/remove-report/${reportId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Report removed successfully!',
      });
      setReportedPosts(reportedPosts.filter(post => post._id !== reportId));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Report removal failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header/>
   <div className='m'>
  <hr /> 
  <Link to="/homeAdmin"><button style={{ display: 'flex', height: '3em', width: '100px', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eeeeee4b', borderRadius: '3px', letterSpacing: '1px', transition: 'all 0.2s linear', cursor: 'pointer', border: 'none', background: '#fff',marginBottom:'30px' }}>
  <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
  <span>Back</span>
</button></Link>
  <Box className='main-cards' sx={{ display: 'flex', gap: 2 }}>
    <div className='card'>
      <Box className='card-inner' sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Typography variant="h6">No of Reported Post</Typography>
        <BsFillArchiveFill className='card_icon' />
        <Typography variant="h4">{reportedPosts.length}</Typography>
      </Box>
    </div>
    <div className='card'>
      <Box className='card-inner' sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Typography variant="h6"></Typography>
        <BsFillGrid3X3GapFill className='card_icon' />
        <Typography variant="h4"></Typography>
      </Box>
    </div>
  </Box>
</div>
      <Box sx={{ padding: '20px' }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          reportedPosts.map((post) => {
            const { _id, reason, postId } = post;
            return (
              <StyledCard key={_id}>
                <CardContent>
                  <Typography variant="h6">ID: {_id}</Typography>
                  <Typography variant="body1">Reason: {reason}</Typography>
                  {postId ? (
                    <>
                      <Typography variant="body2">Content: {postId.content}</Typography>
                      {postId.image && (
                        <StyledCardMedia
                          src={`http://localhost:8000/${postId.image}`}
                          alt="Post Image"
                          title="Post Image"
                        />
                      )}
                    </>
                  ) : (
                    <Typography variant="body2" color="textSecondary">Post details not available.</Typography>
                  )}
                  <StyledButton
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeletePost(postId._id)}
                  >
                    Delete From Database
                  </StyledButton>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    onClick={() => handleRemoveReport(_id)}
                  >
                    No Report Needed
                  </StyledButton>
                </CardContent>
              </StyledCard>
            );
          })
        )}
      </Box>
    </>
  );
};

export default AdminPage;
