const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/auth');
const {register, verifyEmail, login} = require('../controllers/UserController');

router.post("/register",register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);

module.exports = router;