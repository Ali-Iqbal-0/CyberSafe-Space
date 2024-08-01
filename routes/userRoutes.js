import express from 'express';
import UserController from '../controllers/userController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';

const router = express.Router();

// Authentication and User Routes
router.post('/register', UserController.userRegistration);
router.post('/login', UserController.userLogin);
router.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail);
router.post('/reset-password/:id/:token', UserController.userPasswordReset);
router.post('/changepassword', checkUserAuth, UserController.changeUserPassword);
router.get('/loggeduser', checkUserAuth, UserController.loggedUser);
router.get('/fetchTopUsers/:userId', UserController.fetchTopUsers);

// Doctor Profile Setup Routes
router.post('/uploadCertifications', checkUserAuth, UserController.uploadCertifications);
router.post('/setAvailability', checkUserAuth, UserController.setAvailability);
router.get('/profileDr/:userId', checkUserAuth, UserController.getProfileDr);

// New routes for deleting certifications and availability slots
router.delete('/deleteCertification/:userId/:certId', checkUserAuth, UserController.deleteCertification);
router.delete('/deleteAvailabilitySlot/:userId/:slotId', checkUserAuth, UserController.deleteAvailabilitySlot);

router.get('/search', UserController.searchUsers);
router.get('/:userId', UserController.getUserById);
router.get('/doc/:userId', UserController.getDocById);
router.get('/doctorsList/:userId', UserController.getAllDocById);

export default router;
