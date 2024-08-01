import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js'; // Assuming UserModel is correctly imported

const checkAdminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Get token from Authorization header
    const decodedToken = jwt.verify(token, 'aaaaaa1122233'); // Verify and decode token

    // Check if user exists and has an admin role
    const user = await UserModel.findById(decodedToken.userID);
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized. Admin access required' });
    }

    // Set the user object in the request for further processing
    req.user = user;
    next(); // User is an admin, proceed to the next middleware or route handler

  } catch (error) {
    console.error('Error checking admin authorization:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default checkAdminAuth;
