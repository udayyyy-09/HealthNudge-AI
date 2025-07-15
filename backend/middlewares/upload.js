const multer = require('multer');                 //used for file uploads
const path = require('path');                     // used to handle file paths

const storage = multer.memoryStorage();          // Store files in memory

const upload = multer({
    storage,
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if(ext !== 'pdf'){
            return cb(new Error('Only PDF files are allowed'), false);  //reject the file
        }
        cb(null,true); // Accept the file
        
    }
});

module.exports = {upload};