import express from 'express';
import AdminPostController from '../controllers/AdminPostController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';

const router = express.Router();

router.get('/getresources', checkUserAuth, AdminPostController.getResources);
router.post('/createresource', checkUserAuth, AdminPostController.createResource);
router.put('/edit/:id', checkUserAuth, AdminPostController.updateResource);
router.delete('/delete/:id', checkUserAuth, AdminPostController.deleteResource);
router.post('/report/:id', checkUserAuth, AdminPostController.reportResource);
router.get('/userresources/:userId', checkUserAuth, AdminPostController.getUserResources);

export default router;
