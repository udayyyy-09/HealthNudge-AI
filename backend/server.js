require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// app.set('trust proxy', 1);
app.use(cors({
    origin: ["https://health-ai-plum.vercel.app", "http://localhost:3000"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
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
const authMiddleware = require('./middlewares/auth');
// const  upload  = require('./middlewares/upload'); // import multer config
const authRoutes = require('./routes/auth');
const healthRoutes = require('./routes/health');
const aiRoutes = require('./routes/ai');

//Route middleware
app.use('/api', authRoutes);
app.use('/api/health', authMiddleware, healthRoutes);       //authMiddleware is used to protect the health routes
app.use('/api/ai', aiRoutes);                               // AI routes (authentication handled per-route)

//tesing 
app.get('/test', (req,res)=>{
    res.json({message: "Server is running fine"});
});
