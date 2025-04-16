import multer from "multer";

const storage = multer.memoryStorage(); // Store file in memory (not disk)
const upload = multer({ storage });



const fileUpload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept PDFs and other document types
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only PDF and document files are allowed!'));
    }
  }
});
export {
    upload,
    fileUpload
} 
