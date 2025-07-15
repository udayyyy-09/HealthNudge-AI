const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try{
        // const token = req.header('Authorization').replace('Bearer ', '');      Before using cookies I used this line to get token from header Authorization

        //Now I am using cookies to store token 
        const token = req.cookies.token;

        if(!token){
            console.log("No token provided, authorization denied");
            return res.status(401).json({message: "No token provided, authorization denied"});
        }
        
        //if token recieved store it verify it using jwt.verify
        console.log("Token received: ",token);
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decode.userId };
        console.log("Decoded token:", decode);
        console.log("req.user.userId:", req.user.UserId);

        next();
    }catch(err){
        console.error("Authentication error:", err);
        return res.status(401).json({message: "Authentication required"});
    }

};

module.exports = authMiddleware;