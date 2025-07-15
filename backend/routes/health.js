const express = require("express");
const router = express.Router();
const {
  addHealthEntry,
  getUserHealthEntries,
  getHealthSummary,
} = require("../controllers/HealthController");
const authMiddleware = require("../middlewares/auth");

router.post("/add", addHealthEntry);        //protected route
router.get("/my-entries", getUserHealthEntries); 
router.get("/summary", getHealthSummary); //protected route

module.exports = router;