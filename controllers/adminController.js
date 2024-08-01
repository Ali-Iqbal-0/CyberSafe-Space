import Report from '../models/Report.js';
import Post from '../models/Post.js';
import UserModel from '../models/User.js'
import CommentReport from '../models/CommentReport.js';
import Comment from '../models/Comment.js';
const adminController = {
  getReportedPosts: async (req, res) => {
    try {
      const reportedPosts = await Report.find({ reason: { $exists: true, $ne: null } })
        .select('_id postId reason')
        .populate({
          path: 'postId',
          select: 'content image', // Select the fields you want to populate
        })
        .exec();

      if (!reportedPosts || reportedPosts.length === 0) {
        return res.status(404).json({ error: 'No reported posts found' });
      }

      return res.status(200).json({ reportedPosts });
    } catch (error) {
      console.error('Error fetching reported posts:', error);
      return res.status(500).json({ error: 'Unable to fetch reported posts' });
    }
  },

  handleDeletePost: async (req, res) => {
    try {
      const postId = req.params.postId;

      // Delete post from Post database
      const postDeleteResult = await Post.findOneAndDelete({ _id: postId });
      if (!postDeleteResult) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Delete post from Report database
      const reportDeleteResult = await Report.findOneAndDelete({ postId });
      if (!reportDeleteResult) {
        // If deletion from Report database fails, restore the post in Post database
        await Post.create(postDeleteResult); // Assuming postDeleteResult contains the deleted post
        return res.status(500).json({ error: 'Failed to delete post from Report database' });
      }

      return res.status(200).json({ message: 'Post deleted successfully from both databases' });
    } catch (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({ error: 'Post deletion failed' });
    }
  },
  handleRemoveReport: async (req, res) => {
    try {
      const reportId = req.params.reportId;

      // Delete report from Report database
      const reportDeleteResult = await Report.findByIdAndDelete(reportId);
      if (!reportDeleteResult) {
        return res.status(404).json({ error: 'Report not found' });
      }

      return res.status(200).json({ message: 'Report removed successfully' });
    } catch (error) {
      console.error('Error removing report:', error);
      return res.status(500).json({ error: 'Report removal failed' });
    }
  },
  getAdminProfile: async (req, res) => {
    try {
      const adminId = req.user.id; // Assuming adminId is stored in req.user
      const admin = await UserModel.findById(adminId).select('profilePic name email');

      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      return res.status(200).json(admin);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      return res.status(500).json({ error: 'Unable to fetch admin profile' });
    }
  },
  getReportedComments: async (req, res) => {
    try {
      const reportedComments = await CommentReport.find({ reason: { $exists: true, $ne: null } })
        .select('_id commentId reason')
        .populate({
          path: 'commentId',
          select: 'content', // Select the fields you want to populate
        })
        .exec();

      if (!reportedComments || reportedComments.length === 0) {
        return res.status(404).json({ error: 'No reported comments found' });
      }

      return res.status(200).json({ reportedComments });
    } catch (error) {
      console.error('Error fetching reported comments:', error);
      return res.status(500).json({ error: 'Unable to fetch reported comments' });
    }
  },

  handleDeleteComment: async (req, res) => {
    try {
      const commentId = req.params.commentId;

      // Delete comment from Comment database
      const commentDeleteResult = await Comment.findOneAndDelete({ _id: commentId });
      if (!commentDeleteResult) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      // Delete comment from CommentReport database
      const reportDeleteResult = await CommentReport.findOneAndDelete({ commentId });
      if (!reportDeleteResult) {
        // If deletion from CommentReport database fails, restore the comment in Comment database
        await Comment.create(commentDeleteResult); // Assuming commentDeleteResult contains the deleted comment
        return res.status(500).json({ error: 'Failed to delete comment from CommentReport database' });
      }

      return res.status(200).json({ message: 'Comment deleted successfully from both databases' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      return res.status(500).json({ error: 'Comment deletion failed' });
    }
  },

  handleRemoveCommentReport: async (req, res) => {
    try {
      const reportId = req.params.reportId;

      // Delete report from CommentReport database
      const reportDeleteResult = await CommentReport.findByIdAndDelete(reportId);
      if (!reportDeleteResult) {
        return res.status(404).json({ error: 'Report not found' });
      }

      return res.status(200).json({ message: 'Report removed successfully' });
    } catch (error) {
      console.error('Error removing report:', error);
      return res.status(500).json({ error: 'Report removal failed' });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.find({ role: { $ne: 'admin' } }).select('name email profilePic');
      return res.status(200).json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Unable to fetch users' });
    }
  },
  
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.userId;

      // Find and delete the user
      const userDeleteResult = await UserModel.findByIdAndDelete(userId);
      if (!userDeleteResult) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Optionally, delete user's posts and comments
      await Post.deleteMany({ userId });
      await Comment.deleteMany({ userId });

      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'User deletion failed' });
    }
  },
};

export default adminController;
