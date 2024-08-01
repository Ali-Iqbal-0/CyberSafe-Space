// controllers/friendController.js
import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js'
// Function to send a friend request
const sendFriendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    const existingRequest = await FriendRequest.findOne({
      senderId,
      receiverId,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent.' });
    }

    const newRequest = new FriendRequest({
      senderId,
      receiverId,
    });

    await newRequest.save();

    res.status(201).json({ message: 'Friend request sent.' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
  const getPendingRequests = async (req, res) => {
    const { userId } = req.params;
    try {
      const requests = await FriendRequest.find({ receiverId: userId, status: 'pending' }).populate('senderId', 'name profilePic');
      res.status(200).json({ requests });
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Function to accept a friend request
  const acceptRequest = async (req, res) => {
    const { requestId } = req.params;
  
    try {
      const request = await FriendRequest.findById(requestId);
  
      if (!request || request.status !== 'pending') {
        return res.status(404).json({ message: 'Friend request not found or already processed.' });
      }
  
      request.status = 'accepted';
      await request.save();
  
      // Add sender and receiver to each other's friends list
      await User.findByIdAndUpdate(request.senderId, { $push: { friends: request.receiverId } });
      await User.findByIdAndUpdate(request.receiverId, { $push: { friends: request.senderId } });
  
      res.status(200).json({ message: 'Friend request accepted.' });
    } catch (error) {
      console.error('Error accepting friend request:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Function to reject a friend request
  const rejectRequest = async (req, res) => {
    const { requestId } = req.params;
  
    try {
      const request = await FriendRequest.findById(requestId);
  
      if (!request || request.status !== 'pending') {
        return res.status(404).json({ message: 'Friend request not found or already processed.' });
      }
  
      request.status = 'rejected';
      await request.save();
  
      res.status(200).json({ message: 'Friend request rejected.' });
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      res.status(500).json({ message: 'Server error' });
    }
};

const FetchFriend = async (req, res) => {
  const { userId } = req.params;
  try {
    const requests = await FriendRequest.find({
      $or: [ { receiverId: userId }],
      status: 'accepted',
    }).populate('senderId', 'name profilePic')
      .populate('receiverId', 'name profilePic');
    res.json({ success: true, requests });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


export default { sendFriendRequest, getPendingRequests, acceptRequest, rejectRequest,FetchFriend };
