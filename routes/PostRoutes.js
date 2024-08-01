import express from 'express';
import PostController from '../controllers/PostController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';
import Post from '../models/Post.js';
import UserModel from '../models/User.js'; 

const router = express.Router();

// Use the correct import path for the controller
router.post('/createpost', checkUserAuth, PostController.createPost);
router.put('/edit/:postId', checkUserAuth, PostController.editPost);
router.delete('/delete/:postId', checkUserAuth, PostController.deletePost);
router.post('/report/:postId', PostController.reportPost);

router.get('/getposts', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email profilePic', UserModel); 
    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Unable to fetch posts' });
  }
});
router.get('/fetchuserpost/:userId', PostController.fetchUserpost);

router.post('/:postId/comments', checkUserAuth, PostController.addComment);
router.get('/:postId/comments', PostController.fetchComments);
router.put('/comments/:commentId', checkUserAuth, PostController.editComment);
router.delete('/comments/:commentId', checkUserAuth, PostController.deleteComment);
router.post('/report/comment/:commentId', PostController.reportComment);

export default router;
