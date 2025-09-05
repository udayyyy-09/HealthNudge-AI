const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const {analyzeReport, getDietPlan, chat, getReportHistory} = require('../controllers/AIController'); 
const {upload} = require('../middlewares/upload'); // import multer config

// Public endpoints - no authentication required
router.post('/chat', chat);

// Protected endpoints - require authentication
router.get('/diet-plan', authMiddleware,getDietPlan);
router.post('/analyze-report',authMiddleware, upload.single('report'), analyzeReport); 
router.get('/report-history', authMiddleware, getReportHistory);

module.exports = router;
