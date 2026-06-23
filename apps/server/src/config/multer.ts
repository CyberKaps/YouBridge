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

// Reject anything that isn't a video file
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"));
  }
};

// Create the multer instance with our storage configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2 GB max per upload
  },
});

export default upload;
