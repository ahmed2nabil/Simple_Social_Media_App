const jwt = require("jsonwebtoken");

const config = require('../utils/config');

exports.verfiyToken = (req,res,next) => {
    if(!req.headers['authorization']) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }


    var token = req.headers['authorization'].split(' ')[1];

if(!token) 
return res.status(403).json({msg: "No token provided"});
jwt.verify(token,config.secret,function(err, decoded) {
    if(err) return res.status(401).json({msg: "Unauthorized"});

    req.userId = decoded.id;
    next();
})
}