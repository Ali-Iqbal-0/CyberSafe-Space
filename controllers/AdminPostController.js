import Resources from '../models/Resources.js';
import multer from 'multer';
import path from 'path';

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: './uploads/', // Specify the upload directory
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 25000000 }, // Specify file size limit if needed
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb); // Custom function to check file type
  },
}).single('image');

// Function to check the file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|jfif|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Error: Images only!'));
  }
}

// Controller class definition
class AdminPostController {

  // Method to fetch all resources
  static getResources = async (req, res) => {
    try {
      const resources = await Resources.find().populate('userId', 'name email profilePic');
      res.status(200).json({ status: 'success', resources });
    } catch (error) {
      console.error('Error fetching resources:', error);
      res.status(500).json({ status: 'failed', message: 'Error fetching resources' });
    }
  };
  
  

  // Method to create a new resource
  static createResource = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Error uploading image:', err);
        return res.status(400).json({ status: 'failed', message: 'Error uploading image' });
      }

      try {
        const { content, userId } = req.body;
        const { filename, path: imagePath } = req.file || {};
        /*const imagePath = req.file ? req.file.filename : null;*/

        const newResource = new Resources({
          content,
          userId,
          image: imagePath,
        });

        await newResource.save();
        res.status(201).json({ status: 'success', message: 'Resource created successfully', resource: newResource });
      } catch (error) {
        console.error('Error creating resource:', error);
        res.status(500).json({ status: 'failed', message: 'Unable to create resource' });
      }
    });
  };

  // Method to update a resource
  static updateResource = async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;

      const updatedResource = await Resources.findByIdAndUpdate(
        id,
        { content },
        { new: true }
      );

      if (!updatedResource) {
        return res.status(404).json({ status: 'failed', message: 'Resource not found' });
      }

      res.status(200).json({ status: 'success', message: 'Resource updated successfully', resource: updatedResource });
    } catch (error) {
      console.error('Error updating resource:', error);
      res.status(500).json({ status: 'failed', message: 'Unable to update resource' });
    }
  };

  // Method to delete a resource
  static deleteResource = async (req, res) => {
    try {
      const { id } = req.params;

      const deletedResource = await Resources.findByIdAndDelete(id);

      if (!deletedResource) {
        return res.status(404).json({ status: 'failed', message: 'Resource not found' });
      }

      res.status(200).json({ status: 'success', message: 'Resource deleted successfully' });
    } catch (error) {
      console.error('Error deleting resource:', error);
      res.status(500).json({ status: 'failed', message: 'Unable to delete resource' });
    }
  };

  // Method to report a resource
  static reportResource = async (req, res) => {
    try {
      const { id } = req.params;
      const { userId, reason } = req.body;

      const resource = await Resources.findById(id);

      if (!resource) {
        return res.status(404).json({ status: 'failed', message: 'Resource not found' });
      }

      resource.reports.push({ userId, reason });
      await resource.save();

      res.status(200).json({ status: 'success', message: 'Resource reported successfully' });
    } catch (error) {
      console.error('Error reporting resource:', error);
      res.status(500).json({ status: 'failed', message: 'Unable to report resource' });
    }
  };

  // Method to fetch resources by user
  static getUserResources = async (req, res) => {
    try {
      const { userId } = req.params;

      const resources = await Resources.find({ userId }).populate('userId', 'name email profilePic');

      res.status(200).json({ status: 'success', resources });
    } catch (error) {
      console.error('Error fetching user resources:', error);
      res.status(500).json({ status: 'failed', message: 'Error fetching user resources' });
    }
  };
}

export default AdminPostController;
