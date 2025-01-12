const jwt = require('jsonwebtoken');

// I need to verify the token first

const verifyToken = (req,res,next) => {
    // go to the request headers authorization if something is there split it and pull out the first index
    const token = req.headers.authorization?.split(" ")[1];

    //if there is no token throw an error for me
    if(!token){
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // if there is a token then verify the token for me

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
    }
    catch(error){
        return res.status(400).json({ message: 'Invalid token.' });
    }
    next();
}

const authorizationRole = (role) => {
 return(req,res,next)=>{

    if (!role.includes(req.user.role)){
        return res.status(403).json({ message: 'Forbidden: You do not have access.' });
     }
    
     next();
 }   
}

module.exports = { verifyToken, authorizationRole };
