const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middlewares/auth');
const {analyzeReport,getDietPlan, chat} = require('../controllers/AIController'); 
const {upload} = require('../middlewares/upload'); // import multer config


// Protected endpoints - require authentication
router.get('/diet-plan', getDietPlan);
router.post('/analyze-report', upload.single('report'), analyzeReport); 
router.post('/chat', chat);


module.exports = router;
