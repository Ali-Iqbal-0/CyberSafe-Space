import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import UserModel from '../models/User.js';
import transporter from '../config/emailConfig.js';
import CertificationModel from '../models/Doc_certificte.js';
import mongoose from 'mongoose';
import { populate } from 'dotenv';

const storage_user = multer.diskStorage({
  destination: './upload/', // Specify the upload directory
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const storages_doc = multer.diskStorage({
  destination: './uploads/', // Specify the upload directory
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage_user,
  limits: { fileSize: 25000000 }, // Specify file size limit if needed
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb); // Custom function to check file type
  },
}).single('profilePic');

const uploads = multer({
  storage: storages_doc,
  limits: { fileSize: 25000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).array('certifications', 10);

function checkFileTypes(file, cb) {
  cb(null, true); // Accept any file type
}
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
class UserController {
  static userRegistration = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        res.status(400).send({ "status": "failed", "message": "Error uploading image" });
        return;
      }

      const { name, email, password, password_confirmation, role } = req.body;
      const { filename, path: imagePath } = req.file || {};

      if (name && email && password && password_confirmation && role) {
        if (password === password_confirmation) {
          try {
            const userExists = await UserModel.findOne({ email: email });
            if (userExists) {
              res.send({ "status": "failed", "message": "Email already exists" });
              return;
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const newUser = new UserModel({
              name,
              email,
              password: hashPassword,
              role,
              profilePic: imagePath,
            });

            await newUser.save();
            const savedUser = await UserModel.findOne({ email: email });
            const token = jwt.sign({ userID: savedUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
            res.status(201).send({ "status": "success", "message": "Registration Success", "token": token });
          } catch (error) {
            console.log(error);
            res.status(500).send({ "status": "failed", "message": "Unable to Register" });
          }
        } else {
          res.send({ "status": "failed", "message": "Password and Confirm Password don't match" });
        }
      } else {
        res.send({ "status": "failed", "message": "All fields are required or image upload failed" });
      }
    });
    
  };

  static userLogin = async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
      const user = await UserModel.findOne({ email });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });
          res.send({
            status: 'success',
            message: 'Login Success',
            token,
            user: {
              _id: user._id,
              email: user.email,
              role: user.role,
            },
          });
        } else {
          res.send({ status: 'failed', message: 'Email or Password is not Valid' });
        }
      } else {
        res.send({ status: 'failed', message: 'You are not a Registered User' });
      }
    } else {
      res.send({ status: 'failed', message: 'All Fields are Required' });
    }
  };

  static changeUserPassword = async (req, res) => {
    const { userId, password, password_confirmation } = req.body;
    if (!userId || !password || !password_confirmation) {
      return res.send({ status: 'failed', message: 'All Fields are Required' });
    }
  
    if (password !== password_confirmation) {
      return res.send({ status: 'failed', message: "New Password and Confirm New Password don't match" });
    }
  
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.send({ status: 'failed', message: 'User not found' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const newHashPassword = await bcrypt.hash(password, salt);
      await UserModel.findByIdAndUpdate(userId, { $set: { password: newHashPassword } });
      res.send({ status: 'success', message: 'Password changed successfully' });
    } catch (error) {
      res.send({ status: 'failed', message: 'Error changing password' });
    }
  };

  static loggedUser = async (req, res) => {
    res.send({ user: req.user });
  };

  static sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    if (email) {
      const user = await UserModel.findOne({ email });
      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' });
        const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;

        const info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
         to: user.email,
         subject: "Cybersafe Space - Password Reset Link",
         html: ` <h1>Cybersafe Space - Password Reset Link</h1>
         <p>Dear User,</p>
         <p>You have requested to reset your password. Please click the button below to reset your password:</p>
         <a href="${link}">Reset Password</a>
         <p>If you did not request this change, please ignore this email.</p>
         <p>Thank you,</p>
         <p>The Cybersafe Space Team</p>`
        })

        res.send({ status: 'success', message: 'Password Reset Email Sent... Please Check Your Email' });
      } else {
        res.send({ status: 'failed', message: 'Email does not exist' });
      }
    } else {
      res.send({ status: 'failed', message: 'Email Field is Required' });
    }
  };

  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;

    const user = await UserModel.findById(id);
    const new_secret = user._id + process.env.JWT_SECRET_KEY;

    try {
      jwt.verify(token, new_secret);
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({ status: 'failed', message: "New Password and Confirm New Password don't match" });
        } else {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(password, salt);
          await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } });
          res.send({ status: 'success', message: 'Password Reset Successfully' });
        }
      } else {
        res.send({ status: 'failed', message: 'All Fields are Required' });
      }
    } catch (error) {
      res.send({ status: 'failed', message: 'Invalid Token' });
    }
  };

  static uploadCertifications = async (req, res) => {
    uploads(req, res, async (err) => {
      if (err) {
        return res.status(400).send({ status: "failed", message: "Error uploading certifications" });
      }
      try {
        const userId = req.user._id;
        const { degree } = req.body;
        const filePaths = req.files.map(file => ({ path: file.path }));
        const availability = JSON.parse(req.body.availability);
  
        // Create or update the Certification document
        let certification = await CertificationModel.findOne({ userId });
  
        if (!certification) {
          certification = new CertificationModel({ userId, degree, certifications: filePaths, availability });
        } else {
          certification.degree = degree;
          certification.certifications.push(...filePaths);
          certification.availability.push(...availability);
        }
  
        await certification.save();
  
        res.status(200).send({ message: 'Certifications uploaded successfully', certification });
      } catch (error) {
        res.status(500).send({ error: 'Failed to upload certifications' });
      }
    });
  };
  
  static getProfileDr = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await UserModel.findById(userId);
      const certification = await CertificationModel.findOne({ userId: userId });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const response = {
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        certifications: certification ? certification.certifications : [],
        availability: certification ? certification.availability : []
      };
  
      res.send({ status: 'success', data: response });
    } catch (error) {
      console.error('Error fetching profile:', error); // Log the error for debugging
      res.status(500).send({ status: 'failed', message: 'Error fetching profile' });
    }
  };
  
  static deleteCertification = async (req, res) => {
    try {
      const { userId, certId } = req.params;
      const certification = await CertificationModel.findOne({ userId });
  
      if (!certification) {
        return res.status(404).send({ status: 'failed', message: 'Certification not found' });
      }
  
      certification.certifications = certification.certifications.filter(cert => cert._id.toString() !== certId);
      await certification.save();
  
      res.send({ status: 'success', message: 'Certification deleted successfully', data: certification });
    } catch (error) {
      console.error('Error deleting certification:', error);
      res.status(500).send({ status: 'failed', message: 'Error deleting certification' });
    }
  };
  
  static deleteAvailabilitySlot = async (req, res) => {
    try {
      const { userId, slotId } = req.params;
      const certification = await CertificationModel.findOne({ userId });
  
      if (!certification) {
        return res.status(404).send({ status: 'failed', message: 'Availability slot not found' });
      }
  
      certification.availability = certification.availability.filter(slot => slot._id.toString() !== slotId);
      await certification.save();
  
      res.send({ status: 'success', message: 'Availability slot deleted successfully', data: certification });
    } catch (error) {
      console.error('Error deleting availability slot:', error);
      res.status(500).send({ status: 'failed', message: 'Error deleting availability slot' });
    }
  };
  
  static setAvailability = async (req, res) => {
    try {
      const userId = req.user._id;
      const { availability } = req.body;

      await UserModel.findByIdAndUpdate(userId, { availability });

      res.send({ status: 'success', message: 'Availability set successfully' });
    } catch (error) {
      res.status(500).send({ status: 'failed', message: 'Error setting availability' });
    }
  };

  static fetchTopUsers = async (req, res) => {
    try {
      const userId = req.params.userId; // Assuming userId is passed as a parameter in the URL
  
      // Check if userId is valid (you might want to validate it further)
      if (!userId) {
        return res.status(400).send({ status: 'failed', message: 'Invalid user ID' });
      }
    
      const topUsers = await UserModel.find({ _id: { $ne: userId }, role: { $nin: ['admin', 'Doctor'] } })
        .limit(10)
        .select('name profilePic');
    
      res.send({ status: 'success', topUsers });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: 'failed', message: 'Unable to fetch top users' });
    }
  };

  static searchUsers = async (req, res) => {
    const { query } = req.query; // Get the search query from the request
  
    if (!query) {
      return res.status(400).send({ status: 'failed', message: 'Search query is required' });
    }
  
    try {
      let users;
      if (mongoose.Types.ObjectId.isValid(query)) {
        users = await UserModel.find({
          $or: [
            { name: { $regex: query, $options: 'i' } }, // Case-insensitive search by name
            { _id: query } // Exact match by ID
          ]
        }).select('name _id profilePic'); // Select only necessary fields
      } else {
        users = await UserModel.find({
          name: { $regex: query, $options: 'i' } // Case-insensitive search by name only
        }).select('name _id profilePic'); // Select only necessary fields
      }
  
      res.send({ status: 'success', users });
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).send({ status: 'failed', message: 'Error searching users' });
    }
  };
  
  static getUserById = async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Check if userId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ status: 'failed', message: 'Invalid user ID' });
      }
  
      const user = await UserModel.findById(userId).select('name _id profilePic'); 
      if (!user) {
        return res.status(404).send({ status: 'failed', message: 'User not found' });
      }
      res.send(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send({ status: 'failed', message: 'Error fetching user' });
    }
  };
  static getDocById = async (req, res) => {
    const { userId } = req.params;

    try {
        // Check if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ status: 'failed', message: 'Invalid user ID' });
        }

        // Fetch user by ID
        const user = await UserModel.findById(userId).select('name _id profilePic');

        if (!user) {
            return res.status(404).send({ status: 'failed', message: 'User not found' });
        }

        // Fetch certifications for the user
        const certifications = await CertificationModel.find({ userId: user._id }).select('certifications degree availability');

        // Merge certifications data with user object
        const userDataWithCertifications = {
            _id: user._id,
            name: user.name,
            profilePic: user.profilePic,
            certifications: certifications
        };

        // Send combined user data with certifications in the response
        res.send(userDataWithCertifications);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send({ status: 'failed', message: 'Error fetching user' });
    }
};

 // UserController.js

static getAllDocById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ status: 'failed', message: 'Invalid user ID' });
    }

    const doctors = await UserModel.find({ role: "Doctor" }).select('name _id profilePic');
    if (!doctors) {
      return res.status(404).json({ success: false, message: 'No doctors found' });
    }
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

  
}

export default UserController;
