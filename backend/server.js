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

// Diagnostic route to check if SMTP ports are blocked in production
app.get('/api/check-ports', async (req, res) => {
    const net = require('net');
    const ports = [25, 465, 587];
    const results = {};

    const checkPort = (port) => {
        return new Promise((resolve) => {
            const socket = new net.Socket();
            socket.setTimeout(5000); // 5s timeout

            socket.on('connect', () => {
                results[port] = "✅ SUCCESS (Port is open)";
                socket.destroy();
                resolve();
            });

            socket.on('timeout', () => {
                results[port] = "❌ BLOCKED (Timeout)";
                socket.destroy();
                resolve();
            });

            socket.on('error', (err) => {
                results[port] = `❌ BLOCKED (${err.message})`;
                socket.destroy();
                resolve();
            });

            socket.connect(port, 'smtp.gmail.com');
        });
    };

    try {
        await Promise.all(ports.map(p => checkPort(p)));
        res.json({
            message: "Port Connectivity Diagnostic",
            target: "smtp.gmail.com",
            results
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//tesing 
app.get('/test', (req,res)=>{
    res.json({message: "Server is running fine"});
});
