import express from 'express';
import friendController from '../controllers/friendController.js';

const router = express.Router();

router.post('/sendRequest', friendController.sendFriendRequest);
router.get('/:userId/requests', friendController.getPendingRequests);
router.put('/requests/:requestId/accept', friendController.acceptRequest);
router.put('/requests/:requestId/reject', friendController.rejectRequest);
router.get('/:userId/fetchfriend',friendController.FetchFriend);
export default router;
