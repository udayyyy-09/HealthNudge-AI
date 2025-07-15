const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middlewares/auth');
const {analyzeReport,getDietPlan} = require('../controllers/AIController'); 

router.get('/diet-plan', getDietPlan);
router.post('/analyze-report', analyzeReport); 

module.exports = router;
