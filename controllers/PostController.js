import Post from '../models/Post.js';
import Report from '../models/Report.js';
import multer from 'multer';
import path from 'path';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import CommentReport from '../models/CommentReport.js';

const storage = multer.diskStorage({
  destination: './posts/', // Specify the upload directory
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25000000 }, // Specify file size limit if needed
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|jfif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Error: Images only!'));
  }
}

class PostController {
  static createPost = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        return res.status(400).send({ "status": "failed", "message": "Error uploading image" });
      }

      try {
        const { content, userId, anonymous } = req.body;
        const { filename, path: imagePath } = req.file || {};

        const newPost = new Post({
          content,
          userId,
          image: imagePath, // Save image path or null if no image uploaded
          anonymous: anonymous || false, // Default to false if anonymous is not provided
        });

        await newPost.save();
        res.status(201).send({ "status": "success", "message": "Post created successfully", post: newPost });
      } catch (error) {
        console.log(error);
        res.status(500).send({ "status": "failed", "message": "Unable to create post" });
      }
    });
  };

  static editPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { content } = req.body;
      const userId = req.user._id; // Get the authenticated user's ID

      const post = await Post.findOneAndUpdate(
        { _id: postId, userId }, // Update only if the post belongs to the authenticated user
        { content },
        { new: true }
      );

      if (!post) {
        return res.status(404).json({ error: 'Post not found or unauthorized' });
      }

      res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Unable to update post' });
    }
  };

  static deletePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user._id; // Get the authenticated user's ID

      const post = await Post.findOneAndDelete({ _id: postId, userId }); // Delete only if the post belongs to the authenticated user

      if (!post) {
        return res.status(404).json({ error: 'Post not found or unauthorized' });
      }

      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Unable to delete post' });
    }
  };

  static reportPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId, reason } = req.body; // Assuming you have a reason field in the report

      // Create a new report entry in your database
      const newReport = new Report({
        postId,
        userId,
        reason,
      });
      // Save the report to your database
      await newReport.save();

      res.status(200).json({ message: 'Post reported successfully' });
    } catch (error) {
      console.error('Error reporting post:', error);
      res.status(500).json({ error: 'Unable to report post' });
    }
  };

  static fetchUserpost = async (req, res) => {
    const { userId } = req.params;
    try {
      const posts = await Post.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json({ posts });
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ error: 'Unable to fetch user posts' });
    }
  };

  static addComment = async (req, res) => {
    try {
      const { postId } = req.params;
      const { content, userId } = req.body;

      const newComment = new Comment({
        content,
        postId,
        userId,
      });

      await newComment.save();
      res.status(201).json({ status: 'success', message: 'Comment added successfully', comment: newComment });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Unable to add comment' });
    }
  };

  static fetchComments = async (req, res) => {
    try {
      const postId = req.params.postId;
      const comments = await Comment.find({ postId }).populate('userId', 'name email profilePic');
      
      res.status(200).json({ comments });
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  static editComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const userId = req.user._id; // Get the authenticated user's ID

      const comment = await Comment.findOneAndUpdate(
        { _id: commentId, userId }, // Update only if the comment belongs to the authenticated user
        { content },
        { new: true }
      );

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found or unauthorized' });
      }

      res.status(200).json({ message: 'Comment updated successfully', comment });
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(500).json({ error: 'Unable to update comment' });
    }
  };

  static deleteComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user._id; // Get the authenticated user's ID

      const comment = await Comment.findOneAndDelete({ _id: commentId, userId }); // Delete only if the comment belongs to the authenticated user

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found or unauthorized' });
      }

      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ error: 'Unable to delete comment' });
    }
  };

  static reportComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { userId, reason, postId } = req.body;

      // Create a new report entry in your database
      const newReport = new CommentReport({
        commentId,
        userId,
        reason,
        postId,
      });
      // Save the report to your database
      await newReport.save();

      res.status(200).json({ message: 'Comment reported successfully' });
    } catch (error) {
      console.error('Error reporting comment:', error);
      res.status(500).json({ error: 'Unable to report comment' });
    }
  };
}

export default PostController;
