import express from 'express';
import adminController from '../controllers/adminController.js';
import checkAdminAuth from '../middlewares/adminAuthMiddleware.js';
import UserModel from '../models/User.js'; 

const router = express.Router();

router.get('/reported-posts', checkAdminAuth, adminController.getReportedPosts);
router.delete('/delete-post/:postId', adminController.handleDeletePost); 
router.delete('/remove-report/:reportId', adminController.handleRemoveReport); 
router.get('/profile', checkAdminAuth, adminController.getAdminProfile);

router.get('/reported-comments', checkAdminAuth, adminController.getReportedComments);
router.delete('/delete-comment/:commentId', adminController.handleDeleteComment);
router.delete('/removeReport/:reportId', adminController.handleRemoveCommentReport);

router.get('/usersfetch', checkAdminAuth, adminController.getAllUsers);
router.delete('/usersDelete/:userId', checkAdminAuth, adminController.deleteUser);

export default router;
