const multer = require('multer');
const express = require('express');
const tesseract = require('tesseract.js');
const storage = multer.memoryStorage();
// const upload = multer({storage});

const MimeTypes = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/gif': 'webp',
    'application/pdf': 'pdf'
};

const fileFilter = (req,file,cb) =>{
    if(file.mimetype in MimeTypes){
        cb(null, true);
    }else{
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize: 1024 * 1024 * 5 // 5MB
    }
});

module.exports = {upload};    