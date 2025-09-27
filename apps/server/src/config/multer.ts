import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  // Tell multer to save files in the 'uploads/' directory
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  // Create a unique filename for each video to prevent conflicts
  filename: (req, file, cb) => {
    // Example: 1726242686161-my-cool-video.mp4
    const uniqueSuffix = Date.now() + '-' + path.parse(file.originalname).name;
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  },
});

// Create the multer instance with our storage configuration
const upload = multer({ storage: storage });

export default upload;
