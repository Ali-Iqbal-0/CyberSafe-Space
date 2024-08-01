import express from 'express';
import Message from '../models/Chat.js';

const router = express.Router();

router.post('/send', async (req, res) => {
  const { sender, receiver, message } = req.body;
  try {
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();
    res.status(201).send(newMessage);
  } catch (error) {
    res.status(500).send({ message: 'Failed to send message', error });
  }
});

router.get('/:loggedInUserId/:selectedUserId', async (req, res) => {
  const { loggedInUserId, selectedUserId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: loggedInUserId, receiver: selectedUserId },
        { sender: selectedUserId, receiver: loggedInUserId }
      ]
    }).populate('sender receiver', 'name profilePic');
    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch messages', error });
  }
});

export default router;
