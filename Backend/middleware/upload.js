const multer = require("multer");
const path = require("path");

// 1. Configure Storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Make sure the 'uploads' folder exists in your root directory
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    // Format: timestamp + original extension (e.g., 174928392.jpg)
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

// 2. File Filter (Security: Images Only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  
  // Check extension and mime type
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"), false);
  }
};

// 3. Initialize Multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter,
});

module.exports = upload;