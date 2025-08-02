const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middlewares/auth');
const {analyzeReport,getDietPlan} = require('../controllers/AIController'); 
const {upload} = require('../middlewares/upload'); // import multer config

router.get('/diet-plan', getDietPlan);
router.post('/analyze-report',upload.single('report'), analyzeReport); 

module.exports = router;
