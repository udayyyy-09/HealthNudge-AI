const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',     //change link when deployed 
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());
require('dotenv').config();
//connect to mongodb
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
}).catch((err)=>{
    console.error("Error connecting to MongoDB", err);
});

//import routes
const authmiddleware = require('./middlewares/auth');
// const  upload  = require('./middlewares/upload'); // import multer config
const authRoutes = require('./routes/auth');
const healthRoutes = require('./routes/health');
const aiRoutes = require('./routes/ai');

//Route middleware
app.use('/api', authRoutes);
app.use('/api/health', authmiddleware, healthRoutes);       //authmiddleware is used to protect the health routes
app.use('/api/ai', authmiddleware, aiRoutes);               //protect the AI routes

//tesing 
app.get('/test', (req,res)=>{
    res.json({message: "Server is running fine"});
});
